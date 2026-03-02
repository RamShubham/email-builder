import { BUTTONS } from '../../../constant/buttons';
import BaseSidebarPanel from '../ConfigurationPanel/input-panels/helpers/BaseSidebarPanel';

import Block from './Block';

function BlocksPanel() {
  return (
    <BaseSidebarPanel title="Blocks">
      <div className="grid grid-cols-3 gap-2.5">
        {BUTTONS.map((k, i) => (
          <Block
            key={i}
            icon={k.icon}
            label={k.label}
            block={k.block}
          />
        ))}
      </div>
    </BaseSidebarPanel>
  );
}

export default BlocksPanel;
