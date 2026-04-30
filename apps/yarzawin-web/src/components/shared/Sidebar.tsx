// --d-paper-cream: #f5efe1;
//     --d-paper-cream-edge: #d9cfb6;
//     --d-paper-lined: #f6f0e2;
//     --d-paper-dotted: #f4eedc;
//     --d-paper-edge: #d6cdb4;
//     --d-paper-bone: #ede4d0;
//     --d-paper-bone-edge: #cfc4a8;
//

import { Button } from '../ui/button'
import { Icon } from './Icon'

//
export const Sidebar = () => {
  return (
    <aside
      style={{
        // background: 'var(--d-paper-cream)',
        backgroundColor: '#e9dfcb',
        borderRight: '1px solid var(--d-paper-cream-edge)',
      }}
      className="p-2 bg-red-500"
    >
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-sm shadow-none bg-transparent"
          style={{ borderColor: 'var(--d-paper-cream-edge)' }}
        >
          <Icon name="Sun" size={14} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-sm shadow-none bg-transparent"
          style={{ borderColor: 'var(--d-paper-cream-edge)' }}
        >
          <Icon name="Notebook" size={14} />
        </Button>
      </div>
    </aside>
  )
}
