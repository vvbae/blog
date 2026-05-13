export interface Project {
  slug:           string
  title:          string
  description:    string
  tags:           string[]
  videoYouTubeId: string | null
  localVideo:     string | null
  blogSlug:       string | null
  github:         string | null
}

export const projects: Project[] = [
  {
    slug:           'decomposition-learning',
    title:          'Decomposition Learning',
    description:    'Contact-only Diffusion Policy for peg insertion. Negative result + full covariate shift diagnosis.',
    tags:           ['Diffusion Policy', 'ManiSkill3', 'Negative result'],
    videoYouTubeId: null,
    localVideo:     '/videos/success.mp4',
    blogSlug:       'decomposition-learning',
    github:         'https://github.com/vvbae/decomp-learn',
  },
  {
    slug:           'so101-imitation',
    title:          'SO-101 Imitation Learning',
    description:    'First embodied AI attempt: ACT policy trained on 50 teleoped candy-to-box demos on a physical SO-101 arm.',
    tags:           ['LeRobot', 'ACT', 'SO-101', 'First attempt'],
    videoYouTubeId: null,
    localVideo:     null,
    blogSlug:       'so101-imitation',
    github:         null,
  },
]
