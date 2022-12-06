import { managingClient } from "grpc/client/index";
import { PushNotificationRequest } from "../../generated/services/PushNotificationRequest";

export const gRPCManagingSendPushNotification = (
  data: PushNotificationRequest
) => {
  managingClient.ManagerSendPushNotification(
    { profiles: data.profiles },
    (err: any, response: any) => {
      if (err) {
        console.error(err);
        return;
      }

      return response;
    }
  );
};
