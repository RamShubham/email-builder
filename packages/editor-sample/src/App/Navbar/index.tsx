import React, { useState } from 'react';

import { Pencil, Save } from 'lucide-react';

import TinyEmailIcon from '../../assets/tinyEmail.svg';
import { Button } from '@/components/ui/button';

import RenameModal from './RenameModal';
import useNavbar from './useNavbar';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { loading, onSaveHandler, templateName } = useNavbar();

  return (
    <>
      <header
        className="island flex items-center justify-between px-5 h-[52px] gap-16 flex-shrink-0"
        data-testid="navbar"
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => { window.location.href = '/'; }}
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
            data-testid="email-logo"
          >
            <img src={TinyEmailIcon} width={28} height={28} alt="TinyEmail" />
          </button>

          <button
            className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-100/80 rounded-xl px-3 py-1.5 transition-colors min-w-0"
            onClick={() => setOpen(true)}
            data-testid="template-name-container"
          >
            <span
              className="font-semibold text-sm max-w-[16rem] overflow-hidden text-ellipsis whitespace-nowrap"
              data-testid="email-template-name"
            >
              {templateName || 'Untitled Template'}
            </span>
            <Pencil className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" data-testid="template-name-edit-icon" />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={() => onSaveHandler()}
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-700 text-white rounded-full h-8 px-5 text-xs font-medium"
            data-testid="save-button"
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            Save
          </Button>
        </div>
      </header>

      <RenameModal
        open={open}
        loading={loading}
        onSave={onSaveHandler}
        onClose={() => setOpen(false)}
        initialTemplateName={templateName}
      />
    </>
  );
}

export default Navbar;
