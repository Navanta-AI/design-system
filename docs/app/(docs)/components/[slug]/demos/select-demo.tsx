'use client'

import { useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectSeparator } from '@navanta-ai/design-system'
import { Leaf, Carrot, Cherries, Orange } from '@phosphor-icons/react'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface SelectDemoProps {
  meta: ComponentMeta
}

export function SelectDemo({ meta }: SelectDemoProps) {
  const [fruits, setFruits] = useState<string[]>(['apple', 'grapes'])
  return (
    <ComponentPreview
      meta={meta}
      defaultChildren=""
      renderPreview={(props) => (
        <div className="flex w-full max-w-xs flex-col gap-6">
          {/* Single-select (default) */}
          <Select size={props.size as 'sm' | 'md' | 'lg' | undefined} disabled={props.disabled as boolean | undefined} hideCheck={props.hideCheck as boolean | undefined} searchable={props.searchable as boolean | undefined}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple" icon={<Orange weight="duotone" />}>Apple</SelectItem>
                <SelectItem value="banana" icon={<Orange weight="duotone" />}>Banana</SelectItem>
                <SelectItem value="blueberry" icon={<Cherries weight="duotone" />}>Blueberry</SelectItem>
                <SelectItem value="grapes" icon={<Cherries weight="duotone" />}>Grapes</SelectItem>
                <SelectItem value="pineapple" icon={<Orange weight="duotone" />}>Pineapple</SelectItem>
                <SelectItem value="honeycrisp" icon={<Cherries weight="duotone" />}>Honeycrisp apples from the orchard</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Vegetables</SelectLabel>
                <SelectItem value="carrot" icon={<Carrot weight="duotone" />}>Carrot</SelectItem>
                <SelectItem value="celery" icon={<Leaf weight="duotone" />}>Celery</SelectItem>
                <SelectItem value="lettuce" icon={<Leaf weight="duotone" />}>Lettuce</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Multi-select — `multiple` + string[] value; toggles + stays open */}
          <Select
            multiple
            value={fruits}
            onValueChange={setFruits}
            size={props.size as 'sm' | 'md' | 'lg' | undefined}
            disabled={props.disabled as boolean | undefined}
            searchable={props.searchable as boolean | undefined}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select fruits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple" icon={<Orange weight="duotone" />}>Apple</SelectItem>
              <SelectItem value="banana" icon={<Orange weight="duotone" />}>Banana</SelectItem>
              <SelectItem value="blueberry" icon={<Cherries weight="duotone" />}>Blueberry</SelectItem>
              <SelectItem value="grapes" icon={<Cherries weight="duotone" />}>Grapes</SelectItem>
              <SelectItem value="pineapple" icon={<Orange weight="duotone" />}>Pineapple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      codeTemplate={() => `import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@navanta-ai/design-system'

<Select>
  <SelectTrigger className="w-full sm:w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="blueberry">Blueberry</SelectItem>
      <SelectItem value="grapes">Grapes</SelectItem>
      <SelectItem value="pineapple">Pineapple</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

// Multi-select: pass \`multiple\`; value/onValueChange become string[].
// Picking an option TOGGLES it and the menu stays open. The trigger
// summarizes as the single label or "N selected".
const [fruits, setFruits] = useState<string[]>([])

<Select multiple value={fruits} onValueChange={setFruits}>
  <SelectTrigger className="w-full sm:w-[180px]">
    <SelectValue placeholder="Select fruits" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="grapes">Grapes</SelectItem>
  </SelectContent>
</Select>

// Searchable: a search field filters options by label. Auto-enables for lists
// longer than 7 options; force it with \`searchable\` / disable with \`searchable={false}\`.
<Select searchable>
  <SelectTrigger className="w-full sm:w-[180px]">
    <SelectValue placeholder="Search a country" />
  </SelectTrigger>
  <SelectContent>{/* many <SelectItem /> */}</SelectContent>
</Select>`}
    />
  )
}
