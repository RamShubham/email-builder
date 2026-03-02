import isEmpty from 'lodash/isEmpty';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  ASSET_KEY,
  PARENT_KEY,
  PROJECT_KEY,
  QUERY_KEY,
  WORKSPACE_KEY,
} from '../../constant/keys';
import {
  setDocument,
  setGlobalLoader,
  setIds,
  setVariables,
  updateVariables,
  useDocument,
  useIds,
  useVariables,
} from '../../documents/editor/EditorContext';
import mailSDKServices from '../../sdk/mailSDKService';
import encodeParams from '../../utils/encodeParams';
import findVariable from '../../utils/findVariable';
import generateHtml from '../../utils/generateHtml';

const useNavbar = () => {
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState('Untitled Template');
  const hasInitialized = useRef(false);

  const document = useDocument();
  const globalVariables = useVariables();
  const { workspaceId, parentId, projectId, assetId } = useIds();

  const onSaveSuccessHandler = useCallback(
    ({ response, hideAlert = false }: { response: any; hideAlert?: boolean }) => {
      if (response?.status === 'success') {
        const { asset_id = '', asset = {} } = response.result || {};
        setIds({ assetId: asset_id });
        const finalTemplateName = asset?.name || templateName;
        setTemplateName(finalTemplateName);
        window.document.title = `${finalTemplateName} | TinyEmails`;
        window.history.replaceState(
          '',
          '',
          `/asset/?${QUERY_KEY}=${encodeParams({
            [WORKSPACE_KEY]: workspaceId,
            [PROJECT_KEY]: projectId,
            [PARENT_KEY]: parentId,
            [ASSET_KEY]: response.result.asset_id,
          })}`
        );
        if (!hideAlert) {
          toast.success(`${finalTemplateName} template saved successfully.`);
        }
        window.parent.postMessage(
          {
            type: 'EMAIL_TEMPLATE_SAVED',
            payload: {
              message: JSON.stringify({
                status: 'success',
                data: { assetId: response.result.asset_id, name: finalTemplateName },
              }),
            },
          },
          '*'
        );
      }
    },
    [parentId, projectId, templateName, workspaceId]
  );

  const onSaveHandler = useCallback(
    async ({ hideAlert = false, additionalData = {} }: { hideAlert?: boolean; additionalData?: object } = {}) => {
      const updatedVariables = findVariable({ globalVariables, document });
      updateVariables(updatedVariables);
      try {
        setLoading(true);
        const payload = {
          parent_id: parentId,
          project_id: projectId,
          workspace_id: workspaceId,
          name: templateName,
          type: 'FILE',
          annotation: 'EMAIL_TEMPLATE',
          share_to_all: true,
          json: document,
          html: generateHtml(document),
          inputs: Object.keys(updatedVariables).map((variable) => ({ key: variable })),
          ...(assetId && { asset_id: assetId }),
          ...additionalData,
        };
        const response = await mailSDKServices.save(payload);
        onSaveSuccessHandler({ response, hideAlert });
      } catch (error: any) {
        if (!hideAlert) {
          toast.error(error?.message || 'Something Went Wrong');
        }
      } finally {
        setLoading(false);
      }
    },
    [assetId, document, globalVariables, onSaveSuccessHandler, parentId, projectId, templateName, workspaceId]
  );

  const onGetEmailTemplateSuccessHandler = useCallback(
    ({ response }: { response: any }) => {
      const { json = {}, inputs = [], asset = {} } = response.result;
      if (json?.root) {
        setDocument(json);
      }
      if (!isEmpty(inputs)) {
        const variables = inputs.reduce((acc: Record<string, string>, { key }: { key: string }) => {
          acc[key] = '';
          return acc;
        }, {});
        setVariables(variables);
      }
      const name = asset?.name || 'Untitled Template';
      setTemplateName(name);
      window.document.title = `${name} | TinyEmails`;
    },
    []
  );

  const getEmailTemplate = useCallback(async () => {
    try {
      setLoading(true);
      const response = await mailSDKServices.findOne({ asset_id: assetId });
      if (response?.status === 'success') {
        onGetEmailTemplateSuccessHandler({ response });
      }
    } catch (error) {
      console.error('error >>', error);
    } finally {
      setLoading(false);
    }
  }, [assetId, onGetEmailTemplateSuccessHandler]);

  const handleInitialLoad = useCallback(async () => {
    setGlobalLoader(true);
    try {
      if (assetId) {
        await getEmailTemplate();
      } else {
        await onSaveHandler({ hideAlert: true });
      }
    } finally {
      setGlobalLoader(false);
    }
  }, [assetId, getEmailTemplate, onSaveHandler]);

  useEffect(() => {
    if (!hasInitialized.current) {
      handleInitialLoad();
      hasInitialized.current = true;
    }
  }, [handleInitialLoad]);

  return {
    loading,
    onSaveHandler,
    templateName,
    setTemplateName,
  };
};

export default useNavbar;
