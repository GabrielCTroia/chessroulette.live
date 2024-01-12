import React, { useState } from 'react';
import { TextArea } from './TextArea';
import { Button } from './Button';
import { isValidPgn } from '@xmatter/util-kit';
// import { TextArea } from 'src/components/TextArea';

type Props = {
  onChange: (s: string) => void;
  value?: string;
  isInvalid?: boolean;
  containerClassName?: string;
  contentClassName?: string;
};

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
      <div className={`mb-0 flex-1 ${props.contentClassName}`}>
        <TextArea
          // label="Import PGN"
          value={input}
          className="h-full"
          rows={5}
          // onChange={(e) => props.onChange(e.target.value)}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste PGN here"
          hasValidationError={isInvalid}
        />
        {/* </div> */}
      </div>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          disabled={!input}
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
