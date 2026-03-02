import React from 'react';
  import { z } from 'zod';

  import { Image, ImageProps } from '@usewaypoint/block-image';

  import { Button } from '@/components/ui/button';
  import useGenerateImg from './useGenerateImg';

  const urlSchema = z.string().url();

  function CustomImage(props: ImageProps) {
    const { url, alt, height } = props?.props || {};
    const { loading, generateImage } = useGenerateImg();

    const isUrlValid = url ? urlSchema.safeParse(url)?.success : false;

    if (!isUrlValid && alt) {
      return (
        <div
          style={{
            width: '100%',
            height: height as React.CSSProperties['height'],
            background: '#efefef',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            boxSizing: 'border-box',
            position: 'relative',
          }}
          data-testid="image-block"
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          )}
          <img alt={alt} src="" />
          <Button
            variant="default"
            size="sm"
            onClick={() => generateImage({ imageDescription: alt })}
          >
            Generate Image
          </Button>
        </div>
      );
    }

    return <Image {...props} />;
  }

  export default CustomImage;
  