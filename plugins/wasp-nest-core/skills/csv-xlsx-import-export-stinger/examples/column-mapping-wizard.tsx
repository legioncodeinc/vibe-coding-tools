/**
 * column-mapping-wizard.tsx
 * Minimal hand-rolled column-mapping React component for shadcn/ui + Tailwind projects.
 * Alternative to react-spreadsheet-import when avoiding the Chakra UI dependency.
 *
 * Demonstrates: guides/02-column-mapping-ux.md (self-hosted option)
 * Requires: React, shadcn/ui (Select component)
 */

'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

// ---- Types ----

export interface TargetField {
  key: string
  label: string
  required: boolean
}

export interface ColumnMapping {
  sourceColumn: string    // spreadsheet column header
  targetField: string     // canonical schema key ('') means unmapped
}

// ---- Fuzzy auto-match (Jaro-Winkler approximation) ----

function normalizeHeader(s: string): string {
  return s.toLowerCase().replace(/[\s_\-]/g, '')
}

function autoMatch(sourceColumns: string[], targetFields: TargetField[]): ColumnMapping[] {
  return sourceColumns.map((col) => {
    const normalized = normalizeHeader(col)
    const match = targetFields.find((f) => {
      const targetNorm = normalizeHeader(f.key)
      const labelNorm = normalizeHeader(f.label)
      return normalized === targetNorm || normalized === labelNorm ||
             targetNorm.includes(normalized) || normalized.includes(targetNorm)
    })
    return { sourceColumn: col, targetField: match?.key ?? '' }
  })
}

// ---- Component ----

interface ColumnMappingWizardProps {
  sourceColumns: string[]          // headers from the uploaded file
  targetFields: TargetField[]      // your schema's canonical fields
  previewRows?: Record<string, string>[]  // first 3 rows for context
  onConfirm: (mapping: ColumnMapping[]) => void
  onCancel: () => void
}

export function ColumnMappingWizard({
  sourceColumns,
  targetFields,
  previewRows = [],
  onConfirm,
  onCancel,
}: ColumnMappingWizardProps) {
  const [mapping, setMapping] = useState<ColumnMapping[]>(() =>
    autoMatch(sourceColumns, targetFields)
  )

  const updateMapping = (sourceColumn: string, targetField: string) => {
    setMapping((prev) =>
      prev.map((m) =>
        m.sourceColumn === sourceColumn ? { ...m, targetField } : m
      )
    )
  }

  const requiredMapped = targetFields
    .filter((f) => f.required)
    .every((f) => mapping.some((m) => m.targetField === f.key))

  const duplicateTargets = mapping
    .filter((m) => m.targetField !== '')
    .filter((m, i, arr) => arr.findIndex((x) => x.targetField === m.targetField) !== i)
    .map((m) => m.targetField)

  const isValid = requiredMapped && duplicateTargets.length === 0

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Map your columns</h2>
      <p className="text-sm text-muted-foreground">
        Match each column from your file to the correct field. Required fields are marked with *.
      </p>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
        <div className="text-xs font-medium text-muted-foreground">Your column</div>
        <div />
        <div className="text-xs font-medium text-muted-foreground">Maps to</div>

        {mapping.map((m) => (
          <>
            <div key={`src-${m.sourceColumn}`} className="rounded border px-3 py-2 text-sm bg-muted">
              <div className="font-medium">{m.sourceColumn}</div>
              {previewRows[0] && (
                <div className="text-xs text-muted-foreground truncate">
                  e.g. {previewRows[0][m.sourceColumn] ?? '—'}
                </div>
              )}
            </div>
            <div className="text-muted-foreground text-sm">→</div>
            <Select
              key={`target-${m.sourceColumn}`}
              value={m.targetField}
              onValueChange={(val) => updateMapping(m.sourceColumn, val)}
            >
              <SelectTrigger className={duplicateTargets.includes(m.targetField) ? 'border-destructive' : ''}>
                <SelectValue placeholder="— skip —" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">— skip this column —</SelectItem>
                {targetFields.map((f) => (
                  <SelectItem key={f.key} value={f.key}>
                    {f.label}{f.required ? ' *' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ))}
      </div>

      {!requiredMapped && (
        <p className="text-sm text-destructive">
          Required fields not yet mapped:{' '}
          {targetFields
            .filter((f) => f.required && !mapping.some((m) => m.targetField === f.key))
            .map((f) => f.label)
            .join(', ')}
        </p>
      )}

      {duplicateTargets.length > 0 && (
        <p className="text-sm text-destructive">
          Each field can only be mapped once. Remove duplicate mappings to continue.
        </p>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onConfirm(mapping)} disabled={!isValid}>
          Confirm mapping
        </Button>
      </div>
    </div>
  )
}
