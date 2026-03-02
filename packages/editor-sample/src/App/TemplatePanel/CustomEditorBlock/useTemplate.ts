import isEmpty from 'lodash/isEmpty';
  import { useEffect, useState } from 'react';
  import { toast } from 'sonner';

  import { TEditorConfiguration } from '../../../documents/editor/core';
  import {
    resetDocument,
    resetVariables,
    setTemplatePanelLoader,
    useDocument,
    useIds,
  } from '../../../documents/editor/EditorContext';
  import useRequest from '../../../hook/useRequest';
  import getGlobalVariables from '../../../utils/getGlobalVariables';

  const useTemplate = () => {
    const [prompt, setPrompt] = useState('');
    const { workspaceId } = useIds();
    const document = useDocument();

    const [{ loading }, generatetrigger] = useRequest(
      { method: 'post', url: '/api/template/generate' },
      { manual: true }
    );

    const [{ loading: updateLoading }, updateTrigger] = useRequest(
      { method: 'post', url: '/api/template/update' },
      { manual: true }
    );

    const onSuccessHandler = (template: TEditorConfiguration) => {
      resetDocument(template);
      const globalVariables = getGlobalVariables({ document: template });
      resetVariables(globalVariables);
    };

    const generateTemplate = async () => {
      try {
        const { data } = await generatetrigger({ data: { prompt, workspaceId } });
        onSuccessHandler(data.template);
        return data.template;
      } catch (error: any) {
        toast.error('Failed to generate template');
      }
    };

    const updateTemplate = async () => {
      try {
        const { data } = await updateTrigger({ data: { prompt, template: document, workspaceId } });
        onSuccessHandler(data.template);
        return data.template;
      } catch (error) {
        console.log(error);
      }
    };

    const onSubmitHandler = () => {
      if (loading || updateLoading) return;
      if (isEmpty(prompt)) {
        toast.error('Please enter a prompt');
        return;
      }
      if (isEmpty(document.root.data.childrenIds)) {
        generateTemplate();
      } else {
        updateTemplate();
      }
    };

    useEffect(() => {
      setTemplatePanelLoader(loading || updateLoading);
    }, [loading, updateLoading]);

    return {
      onSubmitHandler,
      loading: loading || updateLoading,
      prompt,
      setPrompt,
    };
  };

  export default useTemplate;
  