import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, Upload } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChartBarMultiple } from "@/components/BarChart";
import { authClient } from "@/hooks/useAuth";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "@/components/ui/avatar";

export default function ProfileSettings() {
  const { data: session, isPending } = authClient.useSession(); // ✅ fetch session data

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0D0D0D] text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="min-h-screen w-screen bg-[#0D0D0D] text-white flex flex-col items-center py-12 px-4 relative overflow-hidden">
      <div className="w-full max-w-5xl">
        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full mb-10">
          <TabsList className="bg-neutral-900">
            {["Profile", "Performance"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="data-[state=active]:bg-accent data-[state=active]:text-white text-gray-400 text-sm"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="profile" className="mt-8">
            <Card className="bg-[#141414]/90 backdrop-blur-md border max-w-2xl border-white/10 text-white shadow-2xl">
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
                    {user?.image && (
                      <Avatar className="h-20 w-20 rounded-full">
                        <AvatarImage
                          src={
                            user?.image ||
                            "https://api.dicebear.com/9.x/lorelei/svg"
                          }
                          alt={user?.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <Button
                      size="icon"
                      variant={"default"}
                      className="absolute bottom-0 right-0 rounded-full p-2"
                    >
                      <Upload size={10} />
                    </Button>
                  </div>
                  <div>
                    <p className="font-medium text-lg">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {user?.email || "No email"}
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Your Name*</Label>
                    <Input
                      type="text"
                      defaultValue={user?.name || ""}
                      className="bg-[#1c1c1c] border-white/10 mt-4"
                    />
                  </div>
                  <div>
                    <Label>Email Address*</Label>
                    <Input
                      type="email"
                      defaultValue={user?.email || ""}
                      className="bg-[#1c1c1c] border-white/10 mt-4"
                      disabled
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-6 flex justify-end">
                <Button variant={"cta"} className="flex items-center gap-2">
                  Save Changes <ArrowRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="performance" className="mt-8 overflow-hidden">
            <Card className=" bg-[#141414]/90 backdrop-blur-md border border-white/10 text-white shadow-2xl">
              <CardHeader>
                <CardTitle>Your performance</CardTitle>
                <CardDescription className="text-gray-400">
                  Monthly performance of basis of score and number of mistakes
                </CardDescription>
              </CardHeader>
              <Separator className="bg-white/10" />

              <CardContent className=" space-y-6">
                <ChartBarMultiple />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
