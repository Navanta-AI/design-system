'use client'

import * as React from 'react'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogIcon,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Checkbox,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Dropzone,
  dropzoneUid,
  Progress,
  type DropzoneFile,
} from '@navanta/design-system'
import {
  Info,
  ShareNetwork,
  WarningCircle,
  ClipboardText,
  Check,
  CaretRight,
  CaretLeft,
} from '@phosphor-icons/react'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

const ACTION_BUTTON_CLASS = 'min-w-[96px]'

const LARGE_SLIDES = [
  {
    title: 'Front damage capture',
    description: 'Wide-angle image showing impact on the front panel.',
    gradient: 'linear-gradient(135deg, #1f3b73 0%, #4f74b7 100%)',
  },
  {
    title: 'Side panel evidence',
    description: 'Close-up shot highlighting the affected side section.',
    gradient: 'linear-gradient(135deg, #1b5b4d 0%, #3f9b88 100%)',
  },
  {
    title: 'Serial and invoice proof',
    description: 'Uploaded proof documents for claim verification.',
    gradient: 'linear-gradient(135deg, #6b3b2a 0%, #b96d4a 100%)',
  },
]

export function DialogDemo({ meta }: { meta: ComponentMeta }) {
  const [openMedia, setOpenMedia] = React.useState(false)
  const [openNoMedia, setOpenNoMedia] = React.useState(false)
  const [openDestructive, setOpenDestructive] = React.useState(false)
  const [openForm, setOpenForm] = React.useState(false)
  const [openLargeStepper, setOpenLargeStepper] = React.useState(false)
  const [openLargeSlider, setOpenLargeSlider] = React.useState(false)
  const [activeSlide, setActiveSlide] = React.useState(0)
  const [claimFiles, setClaimFiles] = React.useState<DropzoneFile[]>([])

  const goToPrevSlide = React.useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + LARGE_SLIDES.length) % LARGE_SLIDES.length)
  }, [])

  const goToNextSlide = React.useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % LARGE_SLIDES.length)
  }, [])

  const handleClaimFilesAdded = React.useCallback((newFiles: File[]) => {
    const fresh = newFiles.map((file) => ({ file, id: dropzoneUid() }))
    setClaimFiles((prev) => [...prev, ...fresh])
  }, [])

  const handleClaimFileRemove = React.useCallback((id: string) => {
    setClaimFiles((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return (
    <div className="space-y-12">
      <ComponentPreview
        meta={meta}
        defaultChildren=""
        codeTemplate={(props) => {
          const size = (props.size as string) || 'md'
          if (size === 'lg') {
            return `import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
  Button,
} from '@navanta/design-system'
import * as React from 'react'

export function Example() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Stepper Form</Button>
      <Dialog open={open} onClose={() => setOpen(false)} size="lg" showCloseButton>
        <DialogHeader className="px-6 py-4">
          <DialogTitle>File your claim</DialogTitle>
          <DialogDescription>User flow: Identify product → File claim → Review & submit.</DialogDescription>
        </DialogHeader>
        <DialogBody className="px-6 py-6">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a claim type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="damage">Damage</SelectItem>
              <SelectItem value="missing">Missing Item</SelectItem>
              <SelectItem value="warranty">Warranty</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-4">
            <Textarea label="Describe the issue" placeholder="Provide context for your claim." />
          </div>
        </DialogBody>
        <DialogFooter className="px-6">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Continue</Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}`
          }

          return `import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogIcon, DialogFooter, Button } from '@navanta/design-system'
import { ShareNetwork } from '@phosphor-icons/react'
import * as React from 'react'

const ACTION_BUTTON_CLASS = 'min-w-[96px]'

export function Example() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Media Dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} size="${size}" showCloseButton={false}>
        <DialogHeader className="px-8 py-7">
          <div className="flex items-start gap-5">
            <DialogIcon tone="secondary" className="text-foreground [&>svg]:size-8">
              <ShareNetwork weight="duotone" />
            </DialogIcon>
            <div className="space-y-2">
              <DialogTitle>Share this project?</DialogTitle>
              <DialogDescription>Anyone with the link will be able to view and edit this project.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="px-8">
          <Button size="md" variant="outline" className={ACTION_BUTTON_CLASS} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="md" className={ACTION_BUTTON_CLASS} onClick={() => setOpen(false)}>
            Share
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}`
        }}
        renderPreview={(props) => {
          const dialogSize = ((props.size as 'sm' | 'md' | 'lg' | 'full') || 'md')
          const closeOnOverlay = props.closeOnOverlay as boolean
          const isSmall = dialogSize === 'sm'
          const isLarge = dialogSize === 'lg'
          const isFull = dialogSize === 'full'
          const actionButtonSize = isSmall ? 'sm' : 'md'

          return (
            <>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {isLarge ? (
                  <>
                    <Button variant="outline" onClick={() => setOpenLargeStepper(true)}>
                      Open Stepper Form
                    </Button>
                    <Button onClick={() => setOpenLargeSlider(true)}>Open Image Slider</Button>
                  </>
                ) : isFull ? (
                  <Button onClick={() => setOpenForm(true)}>Open Form Dialog</Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setOpenMedia(true)}>
                      Open Media Dialog
                    </Button>
                    <Button variant="outline" onClick={() => setOpenNoMedia(true)}>
                      Open Plain Dialog
                    </Button>
                    <Button variant="destructive" onClick={() => setOpenDestructive(true)}>
                      Open Destructive Dialog
                    </Button>
                    {!isSmall && <Button onClick={() => setOpenForm(true)}>Open Form Dialog</Button>}
                  </>
                )}
              </div>

              {!isLarge && (
                <>
                  {!isFull && (
                    <>
                      <Dialog
                        open={openMedia}
                        onClose={() => setOpenMedia(false)}
                        size={dialogSize}
                        closeOnOverlay={closeOnOverlay}
                        closeOnEscape={true}
                        showCloseButton={false}
                      >
                        <DialogHeader className={dialogSize === 'sm' ? undefined : 'px-8 py-7'}>
                          <div
                            className={
                              dialogSize === 'sm'
                                ? 'flex flex-col items-center gap-4 text-center'
                                : 'flex items-start gap-5'
                            }
                          >
                            <DialogIcon
                              tone="secondary"
                              className={
                                dialogSize === 'sm'
                                  ? 'h-8 w-8 text-foreground [&>svg]:size-8'
                                  : 'text-foreground [&>svg]:size-8'
                              }
                            >
                              <ShareNetwork weight="duotone" />
                            </DialogIcon>
                            <div className="space-y-2">
                              <DialogTitle>Share this project?</DialogTitle>
                              <DialogDescription className="max-w-[500px]">
                                Anyone with the link will be able to view and edit this project.
                              </DialogDescription>
                            </div>
                          </div>
                        </DialogHeader>
                        <DialogFooter className={dialogSize === 'sm' ? undefined : 'px-8'}>
                          <Button
                            size={actionButtonSize}
                            variant="outline"
                            className={ACTION_BUTTON_CLASS}
                            onClick={() => setOpenMedia(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size={actionButtonSize}
                            className={ACTION_BUTTON_CLASS}
                            onClick={() => setOpenMedia(false)}
                          >
                            {isSmall ? 'Submit' : 'Share'}
                          </Button>
                        </DialogFooter>
                      </Dialog>

                      <Dialog
                        open={openNoMedia}
                        onClose={() => setOpenNoMedia(false)}
                        size={dialogSize}
                        closeOnOverlay={closeOnOverlay}
                        closeOnEscape={true}
                        showCloseButton={false}
                      >
                        <DialogHeader
                          className={
                            dialogSize === 'sm'
                              ? 'items-center bg-background px-8 py-8 text-center'
                              : 'items-start px-8 py-7 text-left'
                          }
                        >
                          <DialogTitle>Share this project?</DialogTitle>
                          <DialogDescription className="max-w-[500px]">
                            Anyone with the link will be able to view and edit this project.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className={dialogSize === 'sm' ? undefined : 'px-8'}>
                          <Button
                            size={actionButtonSize}
                            variant="outline"
                            className={ACTION_BUTTON_CLASS}
                            onClick={() => setOpenNoMedia(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size={actionButtonSize}
                            className={ACTION_BUTTON_CLASS}
                            onClick={() => setOpenNoMedia(false)}
                          >
                            Submit
                          </Button>
                        </DialogFooter>
                      </Dialog>

                      <Dialog
                        open={openDestructive}
                        onClose={() => setOpenDestructive(false)}
                        size={dialogSize}
                        closeOnOverlay={closeOnOverlay}
                        closeOnEscape={true}
                        showCloseButton={false}
                      >
                        <DialogHeader className={dialogSize === 'sm' ? undefined : 'px-8 py-7'}>
                          <div
                            className={
                              dialogSize === 'sm'
                                ? 'flex flex-col items-center gap-4 text-center'
                                : 'flex items-start gap-5'
                            }
                          >
                            <DialogIcon
                              tone="secondary"
                              className={
                                dialogSize === 'sm'
                                  ? 'h-8 w-8 text-foreground [&>svg]:size-8'
                                  : 'text-foreground [&>svg]:size-8'
                              }
                            >
                              <WarningCircle weight="duotone" />
                            </DialogIcon>
                            <div className="space-y-2">
                              <DialogTitle>Delete project?</DialogTitle>
                              <DialogDescription className="max-w-[500px]">
                                This action cannot be undone. All files and activity history will be removed.
                              </DialogDescription>
                            </div>
                          </div>
                        </DialogHeader>
                        <DialogFooter className={dialogSize === 'sm' ? undefined : 'px-8'}>
                          <Button
                            size={actionButtonSize}
                            variant="outline"
                            className={ACTION_BUTTON_CLASS}
                            onClick={() => setOpenDestructive(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size={actionButtonSize}
                            variant="destructive"
                            className={ACTION_BUTTON_CLASS}
                            onClick={() => setOpenDestructive(false)}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </Dialog>
                    </>
                  )}

                  {!isSmall && (
                    <Dialog
                      open={openForm}
                      onClose={() => setOpenForm(false)}
                      size={dialogSize}
                      closeOnOverlay={closeOnOverlay}
                      closeOnEscape={true}
                      showCloseButton
                    >
                      <DialogHeader className="px-8 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <DialogIcon
                              tone="secondary"
                              className="h-[18px] w-[18px] text-foreground [&>svg]:size-[18px]"
                            >
                              <Info weight="duotone" />
                            </DialogIcon>
                            <DialogTitle>Create team</DialogTitle>
                          </div>
                          <DialogDescription className="pl-[26px]">
                            Fill in the details below to create a new team workspace.
                          </DialogDescription>
                        </div>
                      </DialogHeader>
                      <DialogBody className="px-8 py-6">
                        <div className="grid gap-4">
                          <Input id="team-name" label="Team name" placeholder="Marketing Team" size="md" />
                          <Input
                            id="owner-email"
                            label="Owner email"
                            type="email"
                            placeholder="owner@example.com"
                            size="md"
                          />
                          <Checkbox id="confirm-terms" label="Confirm terms and condition" labelWeight="regular" />
                        </div>
                      </DialogBody>
                      <DialogFooter className="px-8">
                        <Button
                          size="md"
                          variant="outline"
                          className={ACTION_BUTTON_CLASS}
                          onClick={() => setOpenForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button size="md" className={ACTION_BUTTON_CLASS} onClick={() => setOpenForm(false)}>
                          Create
                        </Button>
                      </DialogFooter>
                    </Dialog>
                  )}
                </>
              )}

              {isLarge && (
                <>
                  <Dialog
                    open={openLargeStepper}
                    onClose={() => setOpenLargeStepper(false)}
                    size="lg"
                    className="h-[560px]"
                    closeOnOverlay={closeOnOverlay}
                    closeOnEscape={true}
                    showCloseButton
                  >
                    {/* Two-panel layout matching Figma */}
                    <div className="flex h-full overflow-hidden">
                      {/* ── Left stepper panel ── */}
                      <aside className="flex w-[234px] shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-muted/20 px-4 py-5">
                        {/* Header */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <ClipboardText size={24} className="text-foreground" />
                            <span className="text-base font-medium leading-[1.5] text-foreground">New Claim</span>
                          </div>
                          <p className="text-sm leading-normal text-muted-foreground">
                            Identify your product, file the claim details, then review and submit.
                          </p>
                        </div>

                        {/* Steps */}
                        <div className="relative flex flex-col gap-5">
                          {/* Full connector line */}
                          <span className="absolute left-[11px] top-6 h-[72px] w-px bg-border" />
                          {/* Completed portion (step 1 → step 2) */}
                          <span className="absolute left-[11px] top-6 h-9 w-px bg-primary" />

                          {/* Step 1 — completed */}
                          <div className="relative z-10 flex items-center gap-2">
                            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-green-600">
                              <Check size={14} weight="bold" className="text-white" />
                            </span>
                            <span className="px-3 py-1 text-sm font-medium text-foreground">Identify product</span>
                          </div>

                          {/* Step 2 — active */}
                          <div className="relative z-10 flex items-center gap-2">
                            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary">
                              <CaretRight size={14} weight="bold" className="text-white" />
                            </span>
                            <span className="flex-1 rounded-md border border-border bg-background px-3 py-1 text-sm font-medium text-foreground shadow-sm">
                              File claim
                            </span>
                          </div>

                          {/* Step 3 — pending */}
                          <div className="relative z-10 flex items-center gap-2">
                            <span className="size-6 shrink-0 rounded-full border-2 border-border bg-background" />
                            <span className="px-3 py-1 text-sm font-medium text-foreground">Review &amp; Submit</span>
                          </div>
                        </div>
                      </aside>

                      {/* ── Right content panel ── */}
                      <div className="flex flex-1 flex-col overflow-hidden">
                        {/* Progress */}
                        <div className="border-b border-border px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Progress value={66} size="sm" className="max-w-[140px]" />
                            <span className="text-sm font-medium text-muted-foreground">2/3 Completed</span>
                          </div>
                        </div>

                        {/* Form content */}
                        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-4">
                          {/* Step heading */}
                          <div className="flex flex-col gap-1">
                            <h4 className="text-lg font-medium leading-[1.5] text-foreground">File your claim</h4>
                            <p className="text-sm text-muted-foreground">
                              Select claim type, describe the issue, and upload evidence.
                            </p>
                          </div>

                          {/* Fields */}
                          <div className="flex flex-col gap-4">
                            {/* Claim type */}
                            <div className="flex flex-col gap-1">
                              <label className="px-0.5 text-xs font-normal text-muted-foreground">Claim type</label>
                              <Select>
                                <SelectTrigger size="md">
                                  <SelectValue placeholder="Select a claim type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="damage">Damage claim</SelectItem>
                                  <SelectItem value="missing">Missing item claim</SelectItem>
                                  <SelectItem value="warranty">Warranty claim</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Describe the issue */}
                            <Textarea
                              label="Describe the issue"
                              placeholder="What happened, when you noticed it, and any relevant details"
                              className="min-h-[96px]"
                            />

                            {/* Evidence (optional) */}
                            <div className="flex flex-col gap-1">
                              <label className="px-0.5 text-xs font-normal text-muted-foreground">Evidence (optional)</label>
                              <Dropzone
                                files={claimFiles}
                                onFilesAdded={handleClaimFilesAdded}
                                onFileRemove={handleClaimFileRemove}
                                accept=".pdf,.jpg,.jpeg,.png,.xlsx"
                                maxSize={10 * 1024 * 1024}
                                label="Drag & Drop or click to browse"
                                description="Photos, invoices, or supporting documents (PDF, JPG, PNG, XLSX up to 10 MB)"
                                className="[&_[role=button]]:bg-muted/20"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex h-[60px] shrink-0 items-center justify-end gap-2 border-t border-border bg-[#f9f9f9] px-6 dark:bg-zinc-950">
                          <Button
                            size="sm"
                            variant="outline"
                            className={ACTION_BUTTON_CLASS}
                            onClick={() => setOpenLargeStepper(false)}
                          >
                            Cancel
                          </Button>
                          <Button size="sm" className={ACTION_BUTTON_CLASS} onClick={() => setOpenLargeStepper(false)}>
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Dialog>

                  <Dialog
                    open={openLargeSlider}
                    onClose={() => setOpenLargeSlider(false)}
                    size="lg"
                    closeOnOverlay={closeOnOverlay}
                    closeOnEscape={true}
                    showCloseButton
                  >
                    <DialogHeader className="px-8 py-4">
                      <DialogTitle>Claim Image Slider</DialogTitle>
                      <DialogDescription>
                        Browse uploaded evidence and choose the best visual before submission.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogBody className="px-8 py-6">
                      <div className="space-y-4">
                        <div className="relative h-[320px] overflow-hidden rounded-xl border border-border">
                          <div
                            className="absolute inset-0"
                            style={{ background: LARGE_SLIDES[activeSlide].gradient }}
                          />
                          <div className="absolute inset-0 bg-black/25" />

                          <button
                            type="button"
                            onClick={goToPrevSlide}
                            className="absolute left-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-black/35 p-2 text-white"
                            aria-label="Previous slide"
                          >
                            <CaretLeft size={18} weight="bold" />
                          </button>
                          <button
                            type="button"
                            onClick={goToNextSlide}
                            className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-black/35 p-2 text-white"
                            aria-label="Next slide"
                          >
                            <CaretRight size={18} weight="bold" />
                          </button>

                          <div className="absolute bottom-5 left-5 right-5 text-white">
                            <p className="text-lg font-semibold">{LARGE_SLIDES[activeSlide].title}</p>
                            <p className="text-sm/relaxed text-white/90">{LARGE_SLIDES[activeSlide].description}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {LARGE_SLIDES.map((slide, index) => (
                            <button
                              key={slide.title}
                              type="button"
                              onClick={() => setActiveSlide(index)}
                              className={`h-10 flex-1 rounded-md border text-left text-xs ${
                                activeSlide === index
                                  ? 'border-primary bg-primary/10 text-foreground'
                                  : 'border-border bg-background text-muted-foreground'
                              }`}
                            >
                              <span className="block truncate px-3">{slide.title}</span>
                            </button>
                          ))}
                        </div>

                        <div className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
                          User flow: review evidence images, confirm best attachment, then continue.
                        </div>
                      </div>
                    </DialogBody>

                    <DialogFooter className="px-8">
                      <Button
                        size="md"
                        variant="outline"
                        className={ACTION_BUTTON_CLASS}
                        onClick={() => setOpenLargeSlider(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="md"
                        className={ACTION_BUTTON_CLASS}
                        onClick={() => setOpenLargeSlider(false)}
                      >
                        Use selected image
                      </Button>
                    </DialogFooter>
                  </Dialog>
                </>
              )}
            </>
          )
        }}
      />
    </div>
  )
}
