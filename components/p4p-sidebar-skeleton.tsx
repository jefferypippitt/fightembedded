import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function P4PSidebarSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-40 mx-auto" />
      <Card
        className={cn(
          "h-full flex flex-col",
          "border-red-600/10 dark:border-red-600/10",
          "bg-white dark:bg-neutral-950",
          "shadow-xs hover:shadow-md",
          "transition-all duration-200",
          "hover:border-red-600/20 dark:hover:border-red-600/20",
          "relative overflow-hidden group"
        )}
      >
        <div className="absolute inset-0 bg-linear-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/[0.02] group-hover:to-red-600/[0.03] transition-all duration-200" />
        <Tabs defaultValue="male" className="w-full">
          <div className="p-1.5">
            <TabsList className="grid w-full grid-cols-2 bg-red-700/10 dark:bg-red-700/20">
              <TabsTrigger
                value="male"
                className="data-[state=active]:bg-red-600/20 dark:data-[state=active]"
              >
                Male
              </TabsTrigger>
              <TabsTrigger
                value="female"
                className="data-[state=active]:bg-red-600/20 dark:data-[state=active]"
              >
                Female
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="male" className="mt-0">
            <CardContent className="p-1.5 flex-1 relative z-10">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2 p-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="grow space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </TabsContent>
          <TabsContent value="female" className="mt-0">
            <CardContent className="p-1.5 flex-1 relative z-10">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2 p-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="grow space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
