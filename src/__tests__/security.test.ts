import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const SRC_DIR = path.resolve(__dirname, '../app')

function findFilesRecursive(dir: string, ext: string): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findFilesRecursive(fullPath, ext))
    } else if (entry.name.endsWith(ext)) {
      results.push(fullPath)
    }
  }
  return results
}

function findAllSourceFiles(dir: string): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findAllSourceFiles(fullPath))
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      results.push(fullPath)
    }
  }
  return results
}

describe('security: client component isolation', () => {
  it('no "use client" file imports from lib/db or services/', () => {
    const allFiles = findAllSourceFiles(SRC_DIR)
    const violations: string[] = []

    for (const filePath of allFiles) {
      const content = fs.readFileSync(filePath, 'utf-8')
      if (!content.includes("'use client'") && !content.includes('"use client"')) {
        continue
      }
      // Check for imports from db or services
      const lines = content.split('\n')
      for (const line of lines) {
        if (/import\s.*from\s+['"].*lib\/db/.test(line)) {
          violations.push(`${filePath}: imports from lib/db -> ${line.trim()}`)
        }
        if (/import\s.*from\s+['"].*services\//.test(line)) {
          violations.push(`${filePath}: imports from services/ -> ${line.trim()}`)
        }
      }
    }

    expect(violations).toEqual([])
  })
})

describe('security: no public Steam API key', () => {
  it('no NEXT_PUBLIC_STEAM_KEY exists in any source file', () => {
    const allFiles = findAllSourceFiles(SRC_DIR)
    const violations: string[] = []

    for (const filePath of allFiles) {
      const content = fs.readFileSync(filePath, 'utf-8')
      if (content.includes('NEXT_PUBLIC_STEAM_KEY')) {
        violations.push(filePath)
      }
    }

    expect(violations).toEqual([])
  })
})

describe('security: db browser guard', () => {
  it('db.ts has browser guard check if it exists', () => {
    const dbFiles = [
      path.join(SRC_DIR, 'lib', 'db.ts'),
      path.join(SRC_DIR, 'lib', 'db.js'),
    ]

    for (const dbFile of dbFiles) {
      if (fs.existsSync(dbFile)) {
        const content = fs.readFileSync(dbFile, 'utf-8')
        const hasBrowserGuard =
          content.includes('typeof window') ||
          content.includes("typeof globalThis !== 'undefined'") ||
          content.includes('process.browser')
        expect(hasBrowserGuard).toBe(true)
      }
    }
    // If no db file exists, the test passes implicitly
  })
})
