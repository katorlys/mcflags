import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { launchOptions } from '@/data'
import type { LaunchOptionId } from '@/data'
import { useTranslation } from 'react-i18next'

type LaunchOptionsCardProps = {
  getChecked: (optionId: LaunchOptionId) => boolean
  onChange: (optionId: LaunchOptionId, checked: boolean) => void
}

function OptionsCard({ getChecked, onChange }: LaunchOptionsCardProps) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-2">
      {launchOptions.map((option) => (
        <Label className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-md px-1 py-1.5" key={option.id}>
          <Checkbox checked={getChecked(option.id)} onCheckedChange={(checked) => onChange(option.id, checked === true)} />
          <span>{t(option.name)}</span>
          <span className="col-start-2 text-xs leading-5 text-muted-foreground">{t(option.description)}</span>
        </Label>
      ))}
    </div>
  )
}

export { OptionsCard }
