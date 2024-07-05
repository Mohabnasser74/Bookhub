import { useState, useRef, useEffect } from "react";
import AppHeader from "./AppHeader";
import { Link, useLocation } from "react-router-dom";

const TabSwitcher = ({ tabs, isUserFound, username }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get("tab");

  const [selectedId, setSelectedId] = useState(!tab ? tabs[0].id : tab);

  const selectedTab = tabs.find((tab) => tab.id === selectedId);
  const tabRef = useRef(null);

  useEffect(() => {
    !tab ? setSelectedId(tabs[0].id) : setSelectedId(tab);
  }, [tab]);

  useEffect(() => {
    if (tabRef.current) {
      tabRef.current
        .querySelectorAll("li")
        .forEach((tab) =>
          tab.classList.remove("border-y-red-600", "border-solid", "border-b-2")
        );

      tabRef.current
        .querySelector(`.${selectedTab.id}`)
        .classList.add("border-y-red-600", "border-solid", "border-b-2");
    }
  }, [selectedTab?.id]);

  return (
    <>
      <AppHeader>
        {isUserFound && (
          <div className="p-2">
            <nav>
              <ul className="flex gap-4" ref={tabRef}>
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    onClick={() => setSelectedId(tab.id)}
                    className={`${tab.id}`}>
                    <Link
                      to={`${
                        tab.id === "overveiw"
                          ? ""
                          : `/${username}?tab=repositories`
                      }`}>
                      {tab.header}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </AppHeader>
      {selectedTab.content}
    </>
  );
};
export default TabSwitcher;
