import { useMemo, useState } from 'react';

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
  renderContainerHeader?: (tabsHeader: React.ReactNode[]) => React.ReactNode;
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
    const tabs = props.tabs.map((p, i) => (
      <div key={i}>
        {p.renderHeader({
          focus: () => setCurrentTabIndex(i),
          isFocused: i === currentTabIndex,
        })}
      </div>
    ));

    if (props.renderContainerHeader) {
      return props.renderContainerHeader(tabs);
    }

    return (
      <div className={`flex flex-row ${props.headerContainerClassName}`}>
        {tabs.map((c) => c)}
      </div>
    );
  }, [props.renderContainerHeader]);

  return (
    <div className={props.containerClassName}>
      {headerComponent}
      <div className={`flex-1 ${props.contentClassName}`}>
        {props.tabs[currentTabIndex].renderContent({
          focus: setCurrentTabIndex,
          isFocused: true,
        })}
      </div>
    </div>
  );
};
