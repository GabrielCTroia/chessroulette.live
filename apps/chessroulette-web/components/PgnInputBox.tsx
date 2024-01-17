import React, { useState } from 'react';
import { TextArea } from './TextArea';
import { Button } from './Button';
import { isValidPgn } from '@xmatter/util-kit';
import { DragAndDrop } from './DragAndDrop';

type Props = {
  onChange: (s: string) => void;
  value?: string;
  isInvalid?: boolean;
  containerClassName?: string;
  contentClassName?: string;
};

// TODO: Validate PGN

export const PgnInputBox: React.FC<Props> = ({
  value = '',
  isInvalid = false,
  ...props
}) => {
  const [input, setInput] = useState<string>();

  // const isValid = useCallback(() => {
  //   if ()
  // }, [input])

  return (
    <div
      className={`flex flex-col flex-1 gap-3 bg-slate-600s sp-3 ${props.containerClassName}`}
    >
      <div className={`mb-0 flex-1 flex flex-col ${props.contentClassName}`}>
        <TextArea
          // label="Import PGN"
          value={input}
          className="h-full bg-red-500"
          rows={5}
          // onChange={(e) => props.onChange(e.target.value)}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste PGN here"
          hasValidationError={isInvalid}
        />
        <DragAndDrop
          fileTypes={['PGN', 'TXT']}
          className="mt-2 p-2 border-dashed border rounded-md border-slate-600 text-gray-300"
          onUpload={(f: any) => {
            // TODO: Validate PGN

            const fileData = new FileReader();
            fileData.onloadend = (s) => {
              if (s.target && typeof s.target.result === 'string') {
                setInput(s.target.result);
              }
            };
            fileData.readAsText(f);
          }}
        >
          <div className="">Upload or Drop a PGN File here</div>
        </DragAndDrop>
      </div>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          disabled={!input}
          size="sm"
          onClick={() => {
            if (input && isValidPgn(input)) {
              props.onChange(input);
            }
          }}
        >
          Import
        </Button>
        <Button
          type="clear"
          size="sm"
          onClick={() => {
            setInput('');
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
