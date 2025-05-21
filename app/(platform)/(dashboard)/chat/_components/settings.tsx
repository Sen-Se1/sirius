import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const LanguagePage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">
      Language Settings
    </h2>
    <p className="text-gray-600 mb-4">
      Select your preferred language for the application.
    </p>
    <div>
      <Label>Language</Label>
      <Select defaultValue="english">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="spanish">Spanish</SelectItem>
          <SelectItem value="french">French</SelectItem>
          <SelectItem value="german">German</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export const DataManagementPage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">
      Data Management
    </h2>
    <p className="text-gray-600 mb-4">Manage your data and storage.</p>
    <div className="space-y-4">
      <Button className="bg-blue-600 hover:bg-blue-700 text-white ">
        Export Chat History
      </Button>
      <Button className="bg-red-600 hover:bg-red-700 text-white ml-4">
        Clear Cache
      </Button>
    </div>
  </div>
);

export const PreferencesPage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Preferences</h2>
    <p className="text-gray-600 mb-4">
      Set notification sounds and message previews.
    </p>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="notification-sounds">Notification Sounds</Label>
        <Switch id="notification-sounds" defaultChecked={true} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="message-previews">Message Previews</Label>
        <Switch id="message-previews" defaultChecked={false} />
      </div>
    </div>
  </div>
);

export const NotificationsPage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Notifications</h2>
    <p className="text-gray-600 mb-4">
      Configure notification settings for chats.
    </p>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="chat-notifications">Chat Notifications</Label>
        <Switch id="chat-notifications" defaultChecked={true} />
      </div>
      <div className="flex items-center justify-between">
        grinder <Label htmlFor="sound-notifications">Sound Alerts</Label>
        <Switch id="sound-notifications" defaultChecked={false} />
      </div>
    </div>
  </div>
);

export const AppearancePage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Appearance</h2>
    <p className="text-gray-600 mb-4">
      Switch themes or customize chat backgrounds.
    </p>
    <div className="space-y-6">
      <div>
        <Label>Theme</Label>
        <RadioGroup defaultValue="light" className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Dark</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label>Chat Background</Label>
        <Select defaultValue="default">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="pattern">Pattern</SelectItem>
            <SelectItem value="image">Custom Image</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

export const PrivacyPage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Privacy</h2>
    <p className="text-gray-600 mb-4">
      Manage who can see your profile or block contacts.
    </p>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="profile-visibility">Profile Visible to Everyone</Label>
        <Switch id="profile-visibility" defaultChecked={true} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mt-6">Blocked Contacts</h3>
        <ul className="mt-2 space-y-2">
          <li className="flex justify-between items-center">
            <span>Jane Smith</span>
            <Button variant="outline" size="sm">
              Unblock
            </Button>
          </li>
          <li className="flex justify-between items-center">
            <span>Mike Johnson</span>
            <Button variant="outline" size="sm">
              Unblock
            </Button>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export const HelpSupportPage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Help & Support</h2>
    <p className="text-gray-600 mb-4">Access FAQs or contact support.</p>
    <div className="space-y-4">
      <Button variant="link" className="text-blue-600 p-0">
        View Frequently Asked Questions
      </Button>
      <Button variant="link" className="text-blue-600 p-0">
        Email Support Team
      </Button>
    </div>
  </div>
);

export const AboutPage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">About</h2>
    <p className="text-gray-600 mb-4">Version info and terms of service.</p>
    <div className="space-y-2">
      <p className="text-gray-600">App Version: 1.2.3</p>
      <p className="text-gray-600">
        Terms of Service:{" "}
        <a href="#" className="text-blue-600">
          Read Here
        </a>
      </p>
      <p className="text-gray-600">
        Privacy Policy:{" "}
        <a href="#" className="text-blue-600">
          Read Here
        </a>
      </p>
    </div>
  </div>
);
