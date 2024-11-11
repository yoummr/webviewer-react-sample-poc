import React, { useRef, useEffect } from "react";

import WebViewer from "@pdftron/webviewer";

import "./App.css";

const App = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount

  useEffect(() => {
    // If you prefer to use the Iframe implementation, you can replace this line with: WebViewer.Iframe(...)

    WebViewer.WebComponent(
      {
        path: "/webviewer/lib",

        initialDoc: "/files/PDFTRON_about.pdf",

        licenseKey:
          "demo:1731121654634:7efda14b0300000000d88442aeb7486771ed6c1b5dc3ea77601e2b2e98",
      },

      viewer.current
    ).then((instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      instance.UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",

          img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',

          onClick: async () => {
            console.log(
              await annotationManager.exportAnnotations({
                links: false,

                widgets: false,
              })
            );
          },
        });
      });

      documentViewer.addEventListener("documentLoaded", () => {
        annotationManager.setCurrentUser("Rahman");

        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: 1,

          // values are in page coordinates with (0, 0) in the top left

          X: 100,

          Y: 150,

          Width: 200,

          Height: 50,

          Author: annotationManager.getCurrentUser(),
        });

        annotationManager.addAnnotation(rectangleAnnot);

        // need to draw the annotation otherwise it won't show up until the page is refreshed

        annotationManager.redrawAnnotation(rectangleAnnot);
      });
    });
  }, []);

  return (
    <div className="App">
      <div className="header">React sample</div>

      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
