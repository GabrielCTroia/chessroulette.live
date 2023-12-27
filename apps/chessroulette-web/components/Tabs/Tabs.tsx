import { useState } from 'react';

type Props = {
  tabs: {
    renderHeader: (p: {
      focus: () => void;
      isFocused: boolean;
    }) => React.ReactNode;
    renderContent: (p: {
      focus: (tabIndex: number) => void;
      isFocused: boolean;
    }) => React.ReactNode;
  }[];
  currentIndex?: number;
  containerClassName?: string;
  headerContainerClassName?: string;
  contentClassName?: string;
};

export const Tabs = (props: Props) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(
    props.currentIndex || 0
  );

  return (
    <div className={props.containerClassName}>
      <div className={`flex flex-row ${props.headerContainerClassName}`}>
        {props.tabs.map((p, i) => (
          <div key={i}>
            {p.renderHeader({
              focus: () => setCurrentTabIndex(i),
              isFocused: i === currentTabIndex,
            })}
          </div>
        ))}
      </div>
      <div className={`flex-1 ${props.contentClassName}`}>
        {props.tabs[currentTabIndex].renderContent({
          focus: setCurrentTabIndex,
          isFocused: true,
        })}
      </div>
    </div>
  );
};
