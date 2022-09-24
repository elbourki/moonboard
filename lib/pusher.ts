import PushNotifications from "@pusher/push-notifications-server";

export const beamsClient = new PushNotifications({
  instanceId: process.env.NEXT_PUBLIC_PUSHER_INSTANCE!,
  secretKey: process.env.PUSHER_SECRET!,
});
