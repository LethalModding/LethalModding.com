import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MinusIcon from '@mui/icons-material/Remove'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import { alpha, type Theme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useSnackbar } from 'notistack'
import type { ChangeEvent, Dispatch, JSX, SetStateAction } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Loader } from '@/components/_shared/Loader.tsx'
import { useAppStore } from '@/store.ts'
import type { Team } from '@/types/db/Team.ts'
import { slugify } from '@/utility/slugify.ts'

function SectionSummary({
  description,
  title,
}: {
  description: string
  title: string
}): JSX.Element {
  return (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography sx={{ flexBasis: '240px', flexShrink: 0 }} variant="h5">
        {title}
      </Typography>
      <Typography sx={{ color: 'text.secondary', pt: 0.55 }}>{description}</Typography>
    </AccordionSummary>
  )
}

interface SocialLink {
  readonly id: string
  readonly url: string
}

function toSocialLinks(socials: string): SocialLink[] {
  return socials.split(',').map((url) => ({ id: crypto.randomUUID(), url }))
}

/**
 * The team stores its social links as one comma-joined string; each field gets a stable id of
 * its own so removing one from the middle does not hand its neighbour's state to another field.
 */
function SocialLinkFields({
  onChange,
  socials,
}: {
  onChange: (socials: string) => void
  socials: string
}): JSX.Element {
  const [links, setLinks] = useState(() => toSocialLinks(socials))
  // Re-seed when the value changes from outside this editor, e.g. once the team loads.
  if (socials !== links.map((link) => link.url).join(',')) {
    setLinks(toSocialLinks(socials))
  }
  const update = (next: SocialLink[]): void => {
    setLinks(next)
    onChange(next.map((link) => link.url).join(','))
  }

  return (
    <>
      {links.map((link, index) => (
        <TextField
          fullWidth={true}
          key={link.id}
          label="Social Link"
          name="socials"
          onChange={(event) =>
            update(
              links.map((other) =>
                other.id === link.id ? { ...other, url: event.target.value } : other,
              ),
            )
          }
          slotProps={{
            htmlInput: {
              type: 'url',
            },
            input: {
              endAdornment:
                index === links.length - 1 ? (
                  <IconButton
                    onClick={() => update([...links, { id: crypto.randomUUID(), url: '' }])}
                  >
                    <AddIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => update(links.filter((other) => other.id !== link.id))}>
                    <MinusIcon />
                  </IconButton>
                ),
            },
          }}
          value={link.url}
          variant="filled"
        />
      ))}
    </>
  )
}

interface SectionProps {
  expanded: boolean
  onExpand: () => void
}

function ProfileSection({
  expanded,
  onExpand,
  onFieldChange,
  onSocialsChange,
  team,
}: SectionProps & {
  onFieldChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSocialsChange: (socials: string) => void
  team: Team
}): JSX.Element {
  return (
    <Accordion defaultExpanded={true} disableGutters={true} expanded={expanded} onChange={onExpand}>
      <SectionSummary description="Manage your Team's Public Profile." title="Profile" />
      <AccordionDetails
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
        }}
      >
        <TextField
          fullWidth={true}
          label="Name"
          name="name"
          onChange={onFieldChange}
          variant="filled"
          value={team.name}
        />
        <TextField
          fullWidth={true}
          label="Location"
          name="location"
          onChange={onFieldChange}
          variant="filled"
          value={team.location}
        />
        <TextField
          fullWidth={true}
          label="Bio"
          multiline={true}
          name="bio"
          onChange={onFieldChange}
          rows={6}
          sx={{
            gridColumn: '1 / span 2',
          }}
          variant="filled"
          value={team.bio}
        />
        <SocialLinkFields onChange={onSocialsChange} socials={team.socials} />
        <TextField
          fullWidth={true}
          slotProps={{
            htmlInput: {
              type: 'url',
            },
          }}
          label="Website"
          name="website"
          onChange={onFieldChange}
          variant="filled"
          value={team.website}
        />
      </AccordionDetails>
    </Accordion>
  )
}

function DonationsSection({ expanded, onExpand }: SectionProps): JSX.Element {
  return (
    <Accordion disabled={true} disableGutters={true} expanded={expanded} onChange={onExpand}>
      <SectionSummary description="Manage your Team's Donation Settings." title="Donations" />
      <AccordionDetails
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
        }}
      >
        <TextField
          disabled={true}
          fullWidth={true}
          slotProps={{
            htmlInput: {
              type: 'url',
            },
          }}
          label="Donation Link"
          sx={{
            gridColumn: '1 / span 2',
          }}
          variant="filled"
        />
        <FormControlLabel
          checked={true}
          disabled={true}
          control={<Checkbox sx={{ mr: 1.5 }} />}
          label="Show Link on Projects by Default"
          sx={{ px: 2, py: 1 }}
        />
        <FormControlLabel
          checked={true}
          disabled={true}
          control={<Checkbox sx={{ mr: 1.5 }} />}
          label="Show Link on Team Profile"
          sx={{ px: 2, py: 1 }}
        />
      </AccordionDetails>
    </Accordion>
  )
}

function NamespacesSection({
  expanded,
  onExpand,
  onSlugsChange,
  slugs,
}: SectionProps & {
  onSlugsChange: Dispatch<SetStateAction<string[]>>
  slugs: string[]
}): JSX.Element {
  return (
    <Accordion disableGutters={true} expanded={expanded} onChange={onExpand}>
      <SectionSummary description="Manage your Team's Namespaces and Aliases." title="Namespaces" />
      <AccordionDetails
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
        }}
      >
        <Box sx={{ gridColumn: '1 / span 2' }}>
          <Typography gutterBottom={true}>
            Namespaces are how your Team is identified on the platform and mod launchers. Aliases
            are interchangeable with the primary Namespace. Both are case-insensitive and must be
            unique, and cannot be changed once set (so be careful!) A Namespace must be at least 3
            characters long and can only contain letters, numbers, and hyphens.
          </Typography>
        </Box>

        {slugs.map((slug, index) => (
          <TextField
            disabled={true}
            fullWidth={true}
            key={slug}
            label={index === 0 ? 'Primary Name' : `Alias ${index}`}
            name={`slugs[${index}]`}
            onChange={(event) =>
              onSlugsChange((prevSlugs) =>
                prevSlugs.map((prevSlug, i) => (i === index ? event.target.value : prevSlug)),
              )
            }
            value={slug}
            variant="filled"
          />
        ))}
      </AccordionDetails>
    </Accordion>
  )
}

function DangerZoneSection({
  expanded,
  onDelete,
  onExpand,
}: SectionProps & { onDelete: () => void }): JSX.Element {
  return (
    <Accordion
      disableGutters={true}
      expanded={expanded}
      onChange={onExpand}
      sx={{
        backgroundColor: (theme: Theme) => alpha(theme.palette.error.main, 0.2),
      }}
    >
      <SectionSummary description="Delete your Team or Transfer Ownership." title="Danger Zone" />
      <AccordionDetails>
        <Typography gutterBottom={true}>
          This action is immediate and permanent, and cannot be undone.
        </Typography>
        <Typography gutterBottom={true}>This will also delete all your Projects.</Typography>
        <Button
          color="error"
          onClick={onDelete}
          size="small"
          sx={{ mt: 0.5, px: 2 }}
          variant="contained"
        >
          Delete Team
        </Button>
      </AccordionDetails>
    </Accordion>
  )
}

function DeleteTeamDialog({
  onClose,
  onConfirm,
  open,
  teamName,
}: {
  onClose: () => void
  onConfirm: () => void
  open: boolean
  teamName: string
}): JSX.Element {
  const [confirmationName, setConfirmationName] = useState('')
  return (
    <Dialog fullWidth={true} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>Delete Team</DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <DialogContentText>
          <Typography gutterBottom={true}>
            This action is immediate and permanent, and cannot be undone.
          </Typography>
          <Typography gutterBottom={true}>This will also delete all your Projects.</Typography>
          <Typography gutterBottom={true}>To confirm, type the Team Name below.</Typography>
          <TextField
            fullWidth={true}
            label="Team Name"
            onChange={(event) => setConfirmationName(event.target.value)}
            value={confirmationName}
            variant="filled"
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button color="error" disabled={confirmationName !== teamName} onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/** The team's registered namespaces, as an editable local copy. */
function useTeamSlugs(team: Team | null): [string[], Dispatch<SetStateAction<string[]>>] {
  const { enqueueSnackbar } = useSnackbar()
  const supabase = useSupabaseClient()
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    if (!team) {
      return
    }

    supabase
      .from('team_slugs')
      .select('slug')
      .eq('team_id', team.id)
      .then(({ data, error }) => {
        if (error) {
          enqueueSnackbar(`Unable to load team slugs: ${error.message}`, {
            variant: 'error',
          })
        } else {
          setSlugs(data.map((row) => row.slug))
        }
      })
  }, [supabase, team, enqueueSnackbar])

  const [localSlugs, setLocalSlugs] = useState<string[]>(slugs ?? [slugify(team?.name)])
  useEffect(() => setLocalSlugs(slugs), [slugs])
  return [localSlugs, setLocalSlugs]
}

export function TeamProfilePage(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar()
  const team = useAppStore((state) => state.selectedTeam)
  const supabase = useSupabaseClient()
  const [localSlugs, setLocalSlugs] = useTeamSlugs(team)

  const [localTeam, setLocalTeam] = useState<Team>({
    id: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
    owner_id: '',
    bio: '',
    name: '',
    location: '',
    members: [],
    socials: '',
    website: '',
  })
  useEffect(() => {
    if (!team) {
      return
    }
    setLocalTeam(team)

    setLocalSlugs((prev) => {
      if (!prev.length) {
        return [slugify(team.name)]
      }

      return prev
    })
  }, [team, setLocalSlugs])

  const [loading, setLoading] = useState(false)

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setLocalTeam((prevTeam) => ({
      ...prevTeam,
      [name]: value,
    }))
  }, [])

  const [expanded, setExpanded] = useState<string>('profile')

  const setTeam = useAppStore((state) => state.setSelectedTeam)
  const handleSubmit = useCallback(() => {
    setLoading(true)

    supabase
      .from('teams')
      .update(localTeam)
      .eq('id', localTeam.id)
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) {
          enqueueSnackbar('Unable to save changes', { variant: 'error' })
        } else {
          enqueueSnackbar('Changes saved', { variant: 'success' })
          setTeam(data)
        }

        setLoading(false)
      })
  }, [enqueueSnackbar, localTeam, setTeam, supabase])

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const showDeleteModal = useCallback(() => setDeleteModalOpen(true), [])
  const hideDeleteModal = useCallback(() => setDeleteModalOpen(false), [])

  const setSelectedTeamID = useAppStore((state) => state.setSelectedTeamID)
  const confirmDeleteTeam = useCallback(() => {
    setLoading(true)

    supabase
      .from('teams')
      .delete()
      .eq('id', localTeam.id)
      .then(({ error }) => {
        if (error) {
          enqueueSnackbar('Unable to delete Team', { variant: 'error' })
        } else {
          enqueueSnackbar('Team deleted', { variant: 'success' })
          setSelectedTeamID('')

          setLocalSlugs([])
          setLocalTeam({} as Team)
        }

        setLoading(false)
      })
  }, [enqueueSnackbar, localTeam.id, setSelectedTeamID, supabase, setLocalSlugs])

  return (
    <>
      <Loader open={loading} />

      <DeleteTeamDialog
        onClose={hideDeleteModal}
        onConfirm={confirmDeleteTeam}
        open={deleteModalOpen}
        teamName={localTeam.name}
      />

      <ProfileSection
        expanded={expanded === 'profile'}
        onExpand={() => setExpanded('profile')}
        onFieldChange={handleChange}
        onSocialsChange={(socials) => setLocalTeam((prevTeam) => ({ ...prevTeam, socials }))}
        team={localTeam}
      />

      <DonationsSection
        expanded={expanded === 'donation'}
        onExpand={() => setExpanded('donation')}
      />

      <NamespacesSection
        expanded={expanded === 'namespace'}
        onExpand={() => setExpanded('namespace')}
        onSlugsChange={setLocalSlugs}
        slugs={localSlugs}
      />

      <DangerZoneSection
        expanded={expanded === 'danger'}
        onDelete={showDeleteModal}
        onExpand={() => setExpanded('danger')}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 1 }}>
        <Button color="primary" disabled={loading} onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </Box>
    </>
  )
}
