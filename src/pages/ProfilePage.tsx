import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStore } from '../store/userStore';

interface Achievement {
  id: string;
  name: string;
  description: string;
}

interface Activity {
  id: string;
  name: string;
  date: string;
  type: string;
}

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);

  // Adicione dados iniciais para recentActivity e achievements no userStore
  const recentActivity: Activity[] = user.recentActivity || [];
  const achievements: Achievement[] = user.achievements || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className="glass-panel card-hover lg:col-span-1 overflow-hidden border">
          <CardContent className="mt-6 relative z-10">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative w-24 h-24 mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="rounded-full"
                />
              </div>
              
              {/* User Info */}
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
              <p className="text-sm text-center mt-2">{user.bio}</p>
              
              {/* Stats */}
              <div className="mt-4 w-full grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{user.coursesCompleted}</p>
                  <p className="text-sm text-muted-foreground">Cursos Completos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.currentCourses}</p>
                  <p className="text-sm text-muted-foreground">Cursos Ativos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities and Achievements */}
        <Card className="glass-panel card-hover lg:col-span-2">
          <Tabs defaultValue="activity">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Your Dashboard</CardTitle>
                <TabsList>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>View your recent activities and achievements</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="activity" className="mt-0">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="p-3 rounded-lg bg-accent/50 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-medium text-sm">{activity.name}</h4>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="achievements" className="mt-0">
                <ScrollArea className="h-[300px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div 
                        key={achievement.id} 
                        className="p-4 rounded-lg bg-accent/50 border border-border flex flex-col"
                      >
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
