import {
  Globe,
  Instagram,
  Twitch,
  Mail,
  Calendar,
  ExternalLink,
  Linkedin,
  ShoppingCart,
  Youtube,
} from "react-feather";
import React from "react";

export default function LinkIconManager(props: { icon: string }) {
  switch (props.icon) {
    case "globe":
      return (
        <Globe size={20} className={"self-center group-hover:stroke-primary"} />
      );
    case "instagram":
      return (
        <Instagram
          size={20}
          className={"self-center group-hover:stroke-primary"}
        />
      );
    case "twitch":
      return (
        <Twitch
          size={20}
          className={"self-center group-hover:stroke-primary"}
        />
      );
    case "mail":
      return (
        <Mail size={20} className={"self-center group-hover:stroke-primary"} />
      );
    case "calendar":
      return (
        <Calendar
          size={20}
          className={"self-center group-hover:stroke-primary"}
        />
      );
    case "externalLink":
      return (
        <ExternalLink
          size={20}
          className={"self-center group-hover:stroke-primary"}
        />
      );
    case "linkedin":
      return (
        <Linkedin
          size={20}
          className={"self-center group-hover:stroke-primary"}
        />
      );
    case "shoppingCart":
      return (
        <ShoppingCart
          size={20}
          className={"self-center group-hover:stroke-primary"}
        />
      );
    case "youtube":
      return (
        <Youtube
          size={20}
          className={"self-center group-hover:stroke-primary"}
        />
      );
    default:
      return (
        <ExternalLink
          size={20}
          className={"self-center group-hover:stroke-primary"}
        />
      );
  }
}
