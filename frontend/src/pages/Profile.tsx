
import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

export default function ProfileSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: session, isPending} = authClient.  useSession(); // ✅ fetch session data

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0D0D0D] text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute w-[600px] h-[600px] bg-purple-700/30 rounded-full blur-[200px] top-1/3 left-1/3 -z-10" />
      <div className="absolute w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[180px] top-0 left-0 -z-10" />

      <div className="w-full max-w-5xl">
        {/* Tabs */}
        <Tabs defaultValue="account" className="w-full mb-10">
          <TabsList className="bg-transparent border-b border-white/10 flex justify-start space-x-8 rounded-none">
            {["Account", "Password"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-gray-400 rounded-none pb-3 text-sm"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="mt-8">
            <Card className="bg-[#141414]/90 backdrop-blur-md border border-white/10 text-white shadow-2xl">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your personal information here.
                </CardDescription>
              </CardHeader>
              <Separator className="bg-white/10" />

              <CardContent className="pt-8 space-y-8">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src="https://api.dicebear.com/9.x/lorelei/svg"
                      alt="avatar"
                      className="rounded-full w-24 h-24 object-cover border-2 border-white/10"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full bg-purple-600 hover:bg-purple-700 text-white p-2"
                    >
                      <Upload size={16} />
                    </Button>
                  </div>
                  <div>
                    <p className="font-medium text-lg">{user?.name || "User"}</p>
                    <p className="text-sm text-gray-400">{user?.email || "No email"}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Your Full Name*</Label>
                    <Input
                      type="text"
                      defaultValue={user?.name || ""}
                      className="bg-[#1c1c1c] border-white/10 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <Label>Email Address*</Label>
                    <Input
                      type="email"
                      defaultValue={user?.email || ""}
                      className="bg-[#1c1c1c] border-white/10 focus:border-purple-500"
                      disabled
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-6 flex justify-end">
                <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                  Save Changes <ArrowRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password" className="mt-8">
            <Card className="bg-[#141414]/90 backdrop-blur-md border border-white/10 text-white shadow-2xl">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your account password below.
                </CardDescription>
              </CardHeader>
              <Separator className="bg-white/10" />

              <CardContent className="pt-8 space-y-6">
                <div>
                  <Label>New Password*</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-[#1c1c1c] border-white/10 focus:border-purple-500 pr-10"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Confirm Password*</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-[#1c1c1c] border-white/10 focus:border-purple-500 pr-10"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-6 flex justify-end">
                <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                  Update Password <ArrowRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
