import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { launchOptions } from '@/data'

type LaunchOptionsCardProps = {
  getChecked: (optionId: string) => boolean
  onChange: (optionId: string, checked: boolean) => void
}

function OptionsCard({ getChecked, onChange }: LaunchOptionsCardProps) {
  return (
    <div className="grid gap-2">
      {launchOptions.map((option) => (
        <Label className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-md px-1 py-1.5" key={option.id}>
          <Checkbox checked={getChecked(option.id)} onCheckedChange={(checked) => onChange(option.id, checked === true)} />
          <span>{option.name}</span>
          <span className="col-start-2 text-xs leading-5 text-muted-foreground">{option.description}</span>
        </Label>
      ))}
    </div>
  )
}

export { OptionsCard }
