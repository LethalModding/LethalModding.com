import { type NextApiRequest, type NextApiResponse } from 'next/types'

const mods = [

  'BepInEx/BepInExPack',
  'Evaisa/HookGenPatcher',
  'CharlesE2/HostFixes',

  'Lordfirespeed/Free2Move',

  'kuba6000/LC_Masked_Fix',
  'ThePotato/scanForItemsFix',
  'Hamunii/JetpackFallFix',
  'ViViKo/ItemClippingFix',
  'Dev1A3/RecentlyPlayedWith',
  'ShaosilGaming/FlashlightFix',
  'EliteMasterEric/SlimeTamingFix',
  'FutureSavior/Boombox_Sync_Fix',
  'linkoid/DissonanceLagFix',
  'Zaggy1024/PathfindingLagFix',

  'itsmeowdev/DoorFix',
  'monkes_mods/JumpDelayPatch',

  'flerouwu/LC_FastStartup',
  'BlueAmulet/LogNeuter',
  'Dev1A3/LobbyInviteOnly',
  'taffyko/QuickQuitToMenu',
]

export default async function ConcreteModsRecommended(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'OPTIONS') {
    return res.status(204).json({ status: 'ok' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  res.status(200).json(mods)
}
