// To update this file use `yarn dlx pinyarn <yarn_version>` or `npx pinyarn <yarn_version>`
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const zlib = require('zlib');
const { PassThrough } = require('stream');

const config = {
  "yarnUrl": "https://raw.githubusercontent.com/yarnpkg/berry/%40yarnpkg/cli/4.0.2/packages/yarnpkg-cli/bin/yarn.js"
};

const getUrlHash = url => crypto.createHash('sha256').update(url).digest('hex').substring(0, 8);

const YARN_URL_HASH = getUrlHash(config.yarnUrl);
const BERRY_HEADERS = {
  'User-Agent': `pinyarn/?`
};
const YARNRC_YML_PATH = path.join(__dirname, '.yarnrc.yml');
const PLUGIN_LIST = !fs.existsSync(YARNRC_YML_PATH) ? [] : fs.readFileSync(YARNRC_YML_PATH, 'utf-8')
  .split('\n')
  .filter(line => line.includes('.yarn/plugins/@yarnpkg/plugin-'))
  .map(line => line.replace(/^.*\.yarn\/plugins\/@yarnpkg\/plugin-(.*?)(?:-[0-9a-f]{8})?\.cjs$/, '$1'));
const YARN_DIR = path.join(__dirname, '.yarn');
const RELEASES_DIR = path.join(YARN_DIR, 'releases');
const PLUGIN_DIR = path.join(YARN_DIR, 'plugins');
const YARN_BINARY = path.join(RELEASES_DIR, `yarn-${YARN_URL_HASH}.cjs`);
const ALLOWED_DOWNLOAD_HOSTS = new Set(['raw.githubusercontent.com']);
const MAX_REDIRECTS = 3;

const isPathWithin = (filePath, directory) => {
  const resolvedPath = path.resolve(filePath);
  const resolvedDirectory = path.resolve(directory);
  return resolvedPath.startsWith(`${resolvedDirectory}${path.sep}`);
};

const validateDownload = (filePath, url) => {
  if (!isPathWithin(filePath, RELEASES_DIR) && !isPathWithin(filePath, PLUGIN_DIR)) {
    throw new Error(`Refusing to write outside the Yarn directory: ${filePath}`);
  }

  const urlParts = new URL(url);
  if (urlParts.protocol !== 'https:' || !ALLOWED_DOWNLOAD_HOSTS.has(urlParts.hostname)) {
    throw new Error(`Refusing to download from untrusted URL: ${url}`);
  }
};

let stats;
try {
  stats = fs.statSync(RELEASES_DIR);
} catch (e) {}
const CURRENT_YARN_BINARYNAME = !stats ? null : fs.readdirSync(RELEASES_DIR)[0];
const CURRENT_YARN_URL_HASH = !CURRENT_YARN_BINARYNAME ? null : path.basename(CURRENT_YARN_BINARYNAME).slice(0, -path.extname(CURRENT_YARN_BINARYNAME).length).replace('yarn-', '');

const downloadFile = (filePath, url, redirectCount = 0) => {
  validateDownload(filePath, url);
  const urlParts = new URL(url);
  return new Promise((resolve, reject) =>
    https.get({
      host: urlParts.host,
      path: urlParts.pathname + urlParts.search,
      headers: BERRY_HEADERS
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400) {
        if (redirectCount >= MAX_REDIRECTS || !res.headers.location) {
          reject(new Error(`Too many or invalid redirects while downloading ${url}`));
          return;
        }
        const redirectUrl = new URL(res.headers.location, url).toString();
        downloadFile(filePath, redirectUrl, redirectCount + 1).then(resolve, reject);
      } else if (res.statusCode !== 200) {
        reject(new Error(`Error downloading ${url}, status: ${res.statusCode}`));
      } else {
        const isZip = res.headers["content-type"] === 'application/zip';
        if (isZip) {
          const bufs = []
          res
            .on('data', chunk => {
              bufs.push(chunk);
            })
            .on('error', err => {
              reject(err);
            })
            .on('end', () => {
              const buf = Buffer.concat(bufs);
              const name = 'yarnpkg-cli/bundles/yarn-min.js';
              const locOff = buf.indexOf(name);
              const off = buf.indexOf(name, locOff + 1);
              const dataSize = buf.readUInt32LE(off - 26);
              const dataStart = locOff + name.length;
              const data = buf.slice(dataStart, dataStart + dataSize);
              fs.writeFileSync(filePath, zlib.inflateRawSync(data));
              resolve();
            });
        } else {
          const file = fs.createWriteStream(filePath);
          res
            .on('data', chunk => {
              file.write(chunk);
            })
            .on('error', err => {
              reject(err);
            })
            .on('end', () => file.end());
          file
            .on('finish', resolve);
        }
      }
    }).on('error', reject)
  ).catch(err => {
    if (fs.existsSync(filePath))
      fs.unlinkSync(filePath);
    throw err;
  });
}

const promises = []

if (CURRENT_YARN_URL_HASH !== YARN_URL_HASH) {
  if (CURRENT_YARN_BINARYNAME) {
    if (fs.existsSync(RELEASES_DIR))
      fs.rmdirSync(RELEASES_DIR, { recursive: true });
    if (fs.existsSync(PLUGIN_DIR))
      fs.rmdirSync(PLUGIN_DIR, { recursive: true });
  }

  if (!fs.existsSync(RELEASES_DIR))
    fs.mkdirSync(RELEASES_DIR, { recursive: true });

  promises.push(downloadFile(YARN_BINARY, config.yarnUrl));
}

for (const plugin of PLUGIN_LIST) {
  const pluginUrl = (config.pluginUrls || {})[plugin];
  if (pluginUrl) {
    const pluginPath = path.join(PLUGIN_DIR, '@yarnpkg', `plugin-${plugin}-${getUrlHash(pluginUrl)}.cjs`)
    if (!fs.existsSync(pluginPath)) {
      fs.mkdirSync(path.join(PLUGIN_DIR, '@yarnpkg'), { recursive: true });
      promises.push(downloadFile(pluginPath, pluginUrl));
    }
  }
}

if (PLUGIN_LIST.length === 0) {
  if (fs.existsSync(PLUGIN_DIR))
    fs.rmdirSync(PLUGIN_DIR, { recursive: true });
} else {
  const entries = fs.readdirSync(path.join(PLUGIN_DIR, '@yarnpkg'));
  for (const entry of entries) {
    const [,plugin, pluginHash] = entry.match(/plugin-(.*?)(?:-)?([0-9a-f]{8})?\.cjs/);
    const pluginUrl = (config.pluginUrls || {})[plugin];
    if (pluginUrl && (!PLUGIN_LIST.includes(plugin) || getUrlHash(pluginUrl) !== pluginHash))
      fs.unlinkSync(path.join(PLUGIN_DIR, '@yarnpkg', entry));
  }
}

Promise.all(promises)
  .then(
    () => require(YARN_BINARY),
    console.error
  );
