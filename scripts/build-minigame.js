import { cpSync, mkdirSync, existsSync, readdirSync, statSync, rmSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')
const minigame = join(root, 'minigame')
const publicDir = join(root, 'public')

const PREVIEW_FILES = [
  'assets/kenney/SpaceShooterRedux/Backgrounds/darkPurple.png',
  'assets/stages/earth/user/sector-a-base.png',
  'assets/stages/earth/user/cloud-overlay.png',
  'audio/shmup-stage-moon.mp3',
  'audio/shmup-boss-moon.mp3'
]

function copyPublicFile(relativePath) {
  const src = join(publicDir, relativePath)
  const dest = join(minigame, relativePath)
  if (!existsSync(src)) {
    throw new Error(`Missing preview asset: ${relativePath}`)
  }
  mkdirSync(join(dest, '..'), { recursive: true })
  cpSync(src, dest)
}

console.log('=== Building Game Flight for WeChat Mini Game ===\n')

const jsDir = join(minigame, 'js')
if (existsSync(jsDir)) rmSync(jsDir, { recursive: true })
mkdirSync(jsDir, { recursive: true })

const assetsDir = join(minigame, 'assets')
if (existsSync(assetsDir)) rmSync(assetsDir, { recursive: true })
const audioDir = join(minigame, 'audio')
if (existsSync(audioDir)) rmSync(audioDir, { recursive: true })

console.log('[1/3] Building game bundle with Vite...')
execSync('npx vite build --config vite.config.minigame.js', {
  cwd: root,
  stdio: 'inherit'
})

console.log('\n[2/3] Copying compact preview assets...')
PREVIEW_FILES.forEach(copyPublicFile)
console.log(`  Copied: ${PREVIEW_FILES.length} files`)

function getDirSize(dirPath) {
  let size = 0
  if (!existsSync(dirPath)) return size
  const entries = readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)
    if (entry.isDirectory()) {
      size += getDirSize(fullPath)
    } else {
      size += statSync(fullPath).size
    }
  }
  return size
}

console.log('\n[3/3] Build summary:')
const parts = ['js', 'assets', 'audio', 'adapter'].map((d) => {
  const p = join(minigame, d)
  const s = getDirSize(p)
  return { dir: d, size: s }
})
parts.forEach(({ dir, size }) => {
  console.log(`  ${dir}/: ${(size / 1024 / 1024).toFixed(2)} MB`)
})

const totalSize = getDirSize(minigame)
const sizeMB = (totalSize / 1024 / 1024).toFixed(2)
console.log(`  ─────────────────`)
console.log(`  Total: ${sizeMB} MB`)

if (totalSize > 20 * 1024 * 1024) {
  console.warn('\n  WARNING: Exceeds 20MB WeChat limit! Host large assets on a CDN.')
} else if (totalSize > 4 * 1024 * 1024) {
  console.warn(`\n  NOTE: Exceeds 4MB initial package limit. Use subpackages or CDN for assets.`)
} else {
  console.log('\n  Package size is within 4MB limit.')
}

console.log(`\n=== Build complete! Output: minigame/ ===`)
console.log('Open the minigame/ directory in WeChat DevTools to preview.')
