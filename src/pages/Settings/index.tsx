import React, { useState } from "react";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { media } from "../../tokens/breakpoints";
import { SettingsNav, type SettingsSection } from "./components/SettingsNav";
import { ProfileSection } from "./components/ProfileSection";
import { AccountSection } from "./components/AccountSection";
import { NotificationSection } from "./components/NotificationSection";
import { CategoriesSection } from "./components/CategoriesSection";
import { DangerSection } from "./components/DangerSection";

const Body = styled.div`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 24px;
  align-items: start;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

const Content = styled.div`
  display: grid;
  gap: 16px;
  min-width: 0;
`;

export const SettingsPage: React.FC = () => {
  const [section, setSection] = useState<SettingsSection>("profile");

  return (
    <AppShell activeNav="settings" crumb="설정" title="설정">
      <Body>
        <SettingsNav value={section} onChange={setSection} />
        <Content>
          {section === "profile" && <ProfileSection />}
          {section === "account" && <AccountSection />}
          {section === "notifications" && <NotificationSection />}
          {section === "categories" && <CategoriesSection />}
          {section === "danger" && <DangerSection />}
        </Content>
      </Body>
    </AppShell>
  );
};
