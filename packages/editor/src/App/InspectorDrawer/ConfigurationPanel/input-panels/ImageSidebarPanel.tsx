import { ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ImageProps, ImagePropsSchema } from '@usewaypoint/block-image';

import { useIds } from '../../../../documents/editor/EditorContext';
import { ImageSourceModal } from '../image-picker/ImageSourceModal';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextDimensionInput from './helpers/inputs/TextDimensionInput';
import TextInput, { TextInputRef } from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ImageSidebarPanelProps = {
  data: ImageProps & { template?: ImageProps['props'] };
  setData: (v: ImageProps) => void;
};

export default function ImageSidebarPanel({ data, setData }: ImageSidebarPanelProps) {
  const [, setErrors] = useState<unknown>(null);
  const urlRef = useRef<TextInputRef>(null);
  const [imageSourceModalOpen, setImageSourceModalOpen] = useState(false);
  const { workspaceId } = useIds();

  const updateData = (d: unknown) => {
    const res = ImagePropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const handleImageSelected = (url: string) => {
    updateData({ ...data, props: { ...data.props, url } });
    urlRef.current?.setValue(url);
    setImageSourceModalOpen(false);
  };

  return (
    <BaseSidebarPanel title="Image block" dataTestId="image-inspect-panel">
      <Button
        type="button"
        variant="default"
        onClick={() => setImageSourceModalOpen(true)}
        className="w-full gap-2"
        data-testid="inspect-panel-image-picker-button"
      >
        <ImageIcon className="h-4 w-4 shrink-0" />
        Choose image
      </Button>
      <ImageSourceModal
        open={imageSourceModalOpen}
        onOpenChange={setImageSourceModalOpen}
        onImageSelected={handleImageSelected}
        currentAlt={data.props?.alt ?? data.template?.alt ?? undefined}
        currentWidth={data.props?.width ?? data.template?.width}
        currentHeight={data.props?.height ?? data.template?.height}
        workspaceId={workspaceId ?? null}
      />
      <TextInput
        ref={urlRef}
        label="Image URL"
        defaultValue={data.template?.url ?? ''}
        onChange={(url) => updateData({ ...data, props: { ...data.props, url } })}
        dataTestId="inspect-panel-image-url-field"
      />
      <TextInput
        label="Alt text"
        defaultValue={data.template?.alt ?? ''}
        onChange={(alt) => updateData({ ...data, props: { ...data.props, alt } })}
        dataTestId="inspect-panel-image-alt-field"
      />
      <TextInput
        label="Link URL"
        defaultValue={data.template?.linkHref ?? ''}
        onChange={(linkHref) =>
          updateData({ ...data, props: { ...data.props, linkHref: linkHref || undefined } })
        }
        dataTestId="inspect-panel-image-link-field"
      />
      <div className="flex gap-2">
        <TextDimensionInput
          label="Width"
          defaultValue={data.template?.width}
          onChange={(width) => updateData({ ...data, props: { ...data.props, width } })}
          dataTestId="inspect-panel-image-width-field"
        />
        <TextDimensionInput
          label="Height"
          defaultValue={data.template?.height}
          onChange={(height) => updateData({ ...data, props: { ...data.props, height } })}
          dataTestId="inspect-panel-image-height-field"
        />
      </div>
      <MultiStylePropertyPanel
        names={['backgroundColor', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
