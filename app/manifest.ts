import type { MetadataRoute } from "next";
import { ORGANIZER_NAME } from "@/app/constants";
import { getSiteUrl } from "@/lib/site-url";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lecathon 2.0",
    short_name: "Lecathon",
    description: `Flagship hackathon by ${ORGANIZER_NAME}`,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#FACC15",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    id: "/",
  };
}
