import React, { useEffect, useState } from 'react';

import { SortableContext } from '@dnd-kit/sortable';

import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

import SortableTreeItem from './SortableTreeItem';

type BlockTreeProps = {
  items: any[];
  level?: number;
  handleBlockClick: (id: string) => void;
  toggleExpanded: (id: string) => void;
  expandedBlocks: Record<string, boolean>;
};

function BlockTree({
  items,
  level = 0,
  handleBlockClick,
  toggleExpanded,
  expandedBlocks,
}: BlockTreeProps) {
  const [animatedItems, setAnimatedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newItems = items.filter((item) => !animatedItems.has(item.id));
    if (newItems.length > 0) {
      newItems.forEach((item) => {
        setTimeout(() => {
          setAnimatedItems((prev) => new Set(prev).add(item.id));
        }, level * 50);
      });
    }
  }, [items, animatedItems, level]);

  return (
    <SortableContext items={items.map((item) => item.id)}>
      {items.map((item, index) => {
        const hasChildren = item.children.length > 0;
        const isExpanded = Boolean(!expandedBlocks[item.id]);
        const isAnimated = animatedItems.has(item.id);

        return (
          <React.Fragment key={item.id}>
            <div
              style={{
                opacity: isAnimated ? 1 : 0,
                transform: isAnimated ? 'translateX(0)' : 'translateX(-20px)',
                transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${index * 50}ms`,
              }}
            >
              <SortableTreeItem
                item={item}
                level={level}
                handleBlockClick={handleBlockClick}
                toggleExpanded={toggleExpanded}
                isExpanded={isExpanded}
              />
            </div>

            {hasChildren && (
              <Collapsible open={isExpanded}>
                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <ul className="list-none p-0 m-0">
                    <BlockTree
                      items={item.children}
                      level={level + 1}
                      handleBlockClick={handleBlockClick}
                      toggleExpanded={toggleExpanded}
                      expandedBlocks={expandedBlocks}
                    />
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            )}
          </React.Fragment>
        );
      })}
    </SortableContext>
  );
}

export default BlockTree;
