import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json([
    {
      title: "default_model",
      body: {},
    },
    {
      title: "wow",
      body: {
        type: "beep",
      },
    },
    {
      title: "yep",
      body: {
        nodes: [
          {
            width: 244,
            height: 58,
            id: "node_0",
            type: "distribution",
            position: {
              x: 344.5,
              y: 200.5,
            },
            data: {
              dist: {
                name: "Poisson log-likelihood",
                distType: "discrete",
                url: "https://www.pymc.io/projects/docs/en/stable/api/distributions/generated/pymc.Poisson.html",
                image_url:
                  "https://www.pymc.io/projects/docs/en/stable/_images/pymc-Poisson-1.png",
                output: "support",
                input: ["mu"],
              },
            },
            selected: true,
            positionAbsolute: {
              x: 344.5,
              y: 200.5,
            },
            dragging: false,
          },
        ],
        edges: [],
        viewport: {
          x: -303,
          y: -193.5,
          zoom: 2,
        },
      },
    },
  ]);
}
