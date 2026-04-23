import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayout,
  useNotificationProvider,
} from "@refinedev/mui";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ContactsIcon from "@mui/icons-material/Contacts";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PeopleIcon from "@mui/icons-material/People";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { AccountList, AccountShow } from "./pages/accounts";
import { AdminAccountList } from "./pages/admin/accounts";
import { AdminCardCreate, AdminCardList } from "./pages/admin/cards";
import { AdminTransactionList } from "./pages/admin/transactions";
import { AdminUserList } from "./pages/admin/users";
import { CardList, CardShow } from "./pages/cards";
import { ContactCreate, ContactList, ContactShow } from "./pages/contacts";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { TransactionList } from "./pages/transactions";
import { authProvider } from "./providers/auth";
import { adminDataProvider, dataProvider } from "./providers/data";
import { CustomTitle } from "./components/shared/custom-title";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={{
                  default: dataProvider,
                  admin: adminDataProvider,
                }}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "accounts",
                    list: "/accounts",
                    show: "/accounts/show/:id",
                    meta: { icon: <AccountBalanceIcon />, label: "Accounts" },
                  },
                  {
                    name: "cards",
                    list: "/cards",
                    show: "/cards/show/:id",
                    meta: { icon: <CreditCardIcon />, label: "Cards" },
                  },
                  {
                    name: "contacts",
                    list: "/contacts",
                    create: "/contacts/create",
                    show: "/contacts/show/:id",
                    meta: {
                      icon: <ContactsIcon />,
                      label: "Contacts",
                      canDelete: true,
                    },
                  },
                  {
                    name: "transactions",
                    list: "/transactions",
                    meta: { icon: <SwapHorizIcon />, label: "Transactions" },
                  },
                  {
                    name: "admin",
                    meta: { icon: <AdminPanelSettingsIcon />, label: "Admin" },
                  },
                  {
                    name: "accounts",
                    identifier: "adminAccounts",
                    list: "/admin/accounts",
                    meta: {
                      dataProviderName: "admin",
                      parent: "admin",
                      label: "Accounts",
                      canDelete: true,
                    },
                  },
                  {
                    name: "cards",
                    identifier: "adminCards",
                    list: "/admin/cards",
                    create: "/admin/cards/create",
                    meta: {
                      dataProviderName: "admin",
                      parent: "admin",
                      label: "Cards",
                      canDelete: true,
                    },
                  },
                  {
                    name: "users",
                    identifier: "adminUsers",
                    list: "/admin/users",
                    meta: {
                      dataProviderName: "admin",
                      parent: "admin",
                      label: "Users",
                      icon: <PeopleIcon />,
                      canDelete: true,
                    },
                  },
                  {
                    name: "transactions",
                    identifier: "adminTransactions",
                    list: "/admin/transactions",
                    meta: {
                      dataProviderName: "admin",
                      parent: "admin",
                      label: "Transactions",
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "uzOqa5-quDnZP-8ALR9U",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout Header={Header} Title={CustomTitle}>
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="accounts" />}
                    />

                    {/* User routes */}
                    <Route path="/accounts">
                      <Route index element={<AccountList />} />
                      <Route path="show/:id" element={<AccountShow />} />
                    </Route>
                    <Route path="/cards">
                      <Route index element={<CardList />} />
                      <Route path="show/:id" element={<CardShow />} />
                    </Route>
                    <Route path="/contacts">
                      <Route index element={<ContactList />} />
                      <Route path="create" element={<ContactCreate />} />
                      <Route path="show/:id" element={<ContactShow />} />
                    </Route>
                    <Route path="/transactions">
                      <Route index element={<TransactionList />} />
                    </Route>

                    {/* Admin routes */}
                    <Route path="/admin/accounts">
                      <Route index element={<AdminAccountList />} />
                    </Route>
                    <Route path="/admin/cards">
                      <Route index element={<AdminCardList />} />
                      <Route path="create" element={<AdminCardCreate />} />
                    </Route>
                    <Route path="/admin/users">
                      <Route index element={<AdminUserList />} />
                    </Route>
                    <Route path="/admin/transactions">
                      <Route index element={<AdminTransactionList />} />
                    </Route>

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
