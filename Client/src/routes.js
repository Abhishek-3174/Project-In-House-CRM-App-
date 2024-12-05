
import { Icon } from "@chakra-ui/react";
import { HiUsers } from "react-icons/hi";
import { FaBriefcase,FaSearch } from "react-icons/fa";
import {
  MdContacts,
  MdHome,
  MdInsertChartOutlined,
  MdLeaderboard,
  MdLock,
  MdShoppingCart
} from "react-icons/md";
// icon
import React from "react";
import { AiFillFolderOpen, AiOutlineMail } from "react-icons/ai";
import { FaCalendarAlt, FaRupeeSign, FaTasks } from "react-icons/fa";
import { LuBuilding2 } from "react-icons/lu";
import { PiPhoneCallBold } from "react-icons/pi";
import { SiGooglemeet } from "react-icons/si";
import AdvanceSearch from "views/admin/advanceSearch/advanceSearch";

// Admin Imports
const MainDashboard = React.lazy(() => import("views/admin/default"));
const UserDashboard = React.lazy(() => import("views/admin/default"));

// My component
const Contact = React.lazy(() => import('views/admin/contact'));
const ContactView = React.lazy(() => import('views/admin/contact/View'));

const User = React.lazy(() => import("views/admin/users"));
const UserView = React.lazy(() => import("views/admin/users/View"));

const Property = React.lazy(() => import("views/admin/property"));
const PropertyView = React.lazy(() => import("views/admin/property/View"));

const Lead = React.lazy(() => import("views/admin/lead"));
const LeadView = React.lazy(() => import("views/admin/lead/View"));

const Communication = React.lazy(() => import("views/admin/communication"));

const Task = React.lazy(() => import("views/admin/task"));
const Cases = React.lazy(() => import("views/admin/case"));
const Order = React.lazy(() => import("views/admin/order"));
const Program = React.lazy(() => import("views/admin/program"));
const StudentProgram = React.lazy(() => import("views/admin/studentprograms"));
const StudentProgramView = React.lazy(() => import("views/admin/studentprograms/components/studentProgramView"));
const TaskView = React.lazy(() => import("views/admin/task/components/taskView"));
const CaseView = React.lazy(() => import("views/admin/case/components/caseView"));

const Calender = React.lazy(() => import("views/admin/calender"));
const Payments = React.lazy(() => import("views/admin/payments"));

const Document = React.lazy(() => import("views/admin/document"));

const EmailHistory = React.lazy(() => import("views/admin/emailHistory"));
const EmailHistoryView = React.lazy(() => import("views/admin/emailHistory/View"));

const Meeting = React.lazy(() => import("views/admin/meeting"));
const MettingView = React.lazy(() => import("views/admin/meeting/View"));

const PhoneCall = React.lazy(() => import("views/admin/phoneCall"));
const PhoneCallView = React.lazy(() => import("views/admin/phoneCall/View"));

const Report = React.lazy(() => import("views/admin/reports"));

const TextMsg = React.lazy(() => import("views/admin/textMsg"));
const TextMsgView = React.lazy(() => import("views/admin/textMsg/View"));

// Auth Imports
const SignInCentered = React.lazy(() => import("views/auth/signIn"));

const routes = [
  // ========================== Dashboard ==========================
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Dashboard",
    layout: "/user",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: UserDashboard,
  },
  // ========================== Admin Layout ==========================
  // ------------- leads Routes ------------------------
  {
    name: "Leads",
    layout: "/admin",
    both: true,
    path: "/lead",
    icon: <Icon as={MdLeaderboard} width='20px' height='20px' color='inherit' />,
    component: Lead,
  },
  {
    name: "Leads View",
    layout: "/admin",
    both: true,
    under: "lead",
    path: "/leadView/:id",
    component: LeadView,
  },
  // --------------- contact Routes --------------------
  {
    name: "Contacts",
    layout: "/admin",
    both: true,
    path: "/contacts",
    icon: <Icon as={MdContacts} width='20px' height='20px' color='inherit' />,
    component: Contact,
  },
  {
    name: "Account View",
    layout: "/admin",
    both: true,
    under: "contacts",
    path: "/contactView/:id",
    component: ContactView,
  },
  {
    name: "Programs",
    layout: "/admin",
    both: true,
    path: "/program",
    icon: <Icon as={MdContacts} width='20px' height='20px' color='inherit' />,
    component: Program,
  },
  {
    name: "Student Programs",
    layout: "/admin",
    both: true,
    path: "/studentprograms",
    icon: <Icon as={MdContacts} width='20px' height='20px' color='inherit' />,
    component: StudentProgram,
  },
  {
    name: "Orders",
    layout: "/admin",
    both: true,
    path: "/order",
    icon: <Icon as={MdShoppingCart} width='20px' height='20px' color='inherit' />,
    component: Order,
  },
  // ------------- Property Routes ------------------------
  // {
  //   name: "Property",
  //   layout: "/admin",
  //   both: true,
  //   path: "/properties",
  //   icon: <Icon as={LuBuilding2} width='20px' height='20px' color='inherit' />,
  //   component: Property,
  // },
  // {
  //   name: "Property View",
  //   layout: "/admin",
  //   both: true,
  //   under: "properties",
  //   path: "/propertyView/:id",
  //   component: PropertyView,
  // },

  // // ------------- Communication Integration Routes ------------------------
  // {
  //   name: "Communication Integration",
  //   layout: "/admin",
  //   both: true,
  //   path: "/communication-integration",
  //   icon: <Icon as={GiSatelliteCommunication} width='20px' height='20px' color='inherit' />,
  //   component: Communication,
  // },
  // ------------- Task Routes ------------------------
  {
    name: " Tasks",
    layout: "/admin",
    both: true,
    path: "/task",
    icon: <Icon as={FaTasks} width='20px' height='20px' color='inherit' />,
    component: Task,
  },
  {
    name: " Cases",
    layout: "/admin",
    both: true,
    path: "/case",
    icon: <Icon as={FaBriefcase} width='20px' height='20px' color='inherit' />,
    component: Cases,
  },
  {
    name: "Tasks View",
    layout: "/admin",
    both: true,
    under: "task",
    path: "/view/:id",
    component: TaskView,
  },
  {
    name: "Case View",
    layout: "/admin",
    both: true,
    under: "case",
    path: "/caseView/view/:id",
    component: CaseView,
  },
  {
    name: "Student Program View",
    layout: "/admin",
    both: true,
    under: "studentprograms",
    path: "/studentprogram/view/:id",
    component: StudentProgramView,
  },
  // ------------- Meeting Routes ------------------------
  {
    name: "Meeting",
    layout: "/admin",
    both: true,
    path: "/metting",
    icon: <Icon as={SiGooglemeet} width='20px' height='20px' color='inherit' />,
    component: Meeting,
  },
  {
    name: "Meeting View",
    layout: "/admin",
    both: true,
    under: "metting",
    path: "/metting/:id",
    component: MettingView,
  },
  // ------------- Phone Routes ------------------------
  {
    name: "Calls",
    layout: "/admin",
    both: true,
    path: "/phone-call",
    icon: <Icon as={PiPhoneCallBold} width='20px' height='20px' color='inherit' />,
    component: PhoneCall,
  },
  {
    name: "Calls View",
    layout: "/admin",
    both: true,
    under: "phone-call",
    path: "/phone-call/:id",
    component: PhoneCallView,
  },
  // ------------- Email Routes------------------------
  {
    // separator: 'History',
    name: "Emails",
    layout: "/admin",
    both: true,
    path: "/email",
    icon: <Icon as={AiOutlineMail} width='20px' height='20px' color='inherit' />,
    component: EmailHistory,
  },
  {
    name: "Emails View",
    layout: "/admin",
    both: true,
    under: "email",
    path: "/Email/:id",
    component: EmailHistoryView,
  },
  // ------------- Calender Routes ------------------------
  {
    name: "Calender",
    layout: "/admin",
    both: true,
    path: "/calender",
    icon: <Icon as={FaCalendarAlt} width='20px' height='20px' color='inherit' />,
    component: Calender,
  },
  // ------------- Payments Routes ------------------------
  // {
  //   name: "Payments",
  //   layout: "/admin",
  //   both: true,
  //   path: "/payments",
  //   icon: <Icon as={FaRupeeSign} width='20px' height='20px' color='inherit' />,
  //   component: Payments,
  // },
  // // ------------- Text message Routes ------------------------
  // {
  //   name: "Text Msg",
  //   layout: "/admin",
  //   both: true,
  //   path: "/text-msg",
  //   icon: <Icon as={MdOutlineMessage} width='20px' height='20px' color='inherit' />,
  //   component: TextMsg,
  // },
  // {
  //   name: "Text Msg View",
  //   layout: "/admin",
  //   both: true,
  //   under: "text-msg",
  //   path: "/text-msg/:id",
  //   component: TextMsgView,
  // },
  // ------------- user Routes ------------------------
  {
    name: " Advance Search",
    layout: "/admin",
    both: true,
    path: "/search",
    icon: <Icon as={FaSearch} width="20px" height="20px" color="inherit" />,
    component: AdvanceSearch,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "/user",
    icon: <Icon as={HiUsers} width='20px' height='20px' color='inherit' />,
    component: User,
  },
  {
    name: "User View",
    both: true,
    layout: "/admin",
    under: "user",
    path: "/userView/:id",
    component: UserView,
  },
  // ========================== User layout ==========================

  // ========================== auth layout ==========================
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
];

export default routes;
