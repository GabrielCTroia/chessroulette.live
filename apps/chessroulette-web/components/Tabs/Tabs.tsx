import { useMemo, useState } from 'react';

type Tab = {
  renderHeader: (p: {
    focus: () => void;
    isFocused: boolean;
  }) => React.ReactNode;
  renderContent: (p: {
    focus: (tabIndex: number) => void;
    isFocused: boolean;
  }) => React.ReactNode;
};

type Props = {
  tabs: (Tab | undefined)[];
  renderContainerHeader?: (p: {
    tabs: React.ReactNode[];
    focus: (tabIndex: number) => void;
  }) => React.ReactNode;
  currentIndex?: number;
  containerClassName?: string;
  headerContainerClassName?: string;
  contentClassName?: string;
};

export const Tabs = (props: Props) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(
    props.currentIndex || 0
  );

  const headerComponent = useMemo(() => {
    const tabs = props.tabs
      // .filter((m) => !!m)
      .map((p, i) => {
        // if (!p) {
        //   return null;
        // }

        return (
          <div key={i}>
            {p?.renderHeader({
              focus: () => setCurrentTabIndex(i),
              isFocused: i === currentTabIndex,
            })}
          </div>
        );
      });

    if (props.renderContainerHeader) {
      return props.renderContainerHeader({
        tabs,
        focus: setCurrentTabIndex,
      });
    }

    return (
      <div className={`flex flex-row ${props.headerContainerClassName}`}>
        {tabs.map((c) => c)}
      </div>
    );
  }, [currentTabIndex, props.renderContainerHeader]);

  return (
    <div className={props.containerClassName}>
      {headerComponent}
      <div className={`flex-1 ${props.contentClassName}`}>
        {props.tabs[currentTabIndex]?.renderContent({
          focus: setCurrentTabIndex,
          isFocused: true,
        })}
      </div>
    </div>
  );
};
