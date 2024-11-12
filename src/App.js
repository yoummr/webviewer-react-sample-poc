import React, { useRef, useEffect } from "react";

import WebViewer from "@pdftron/webviewer";

import "./App.css";

const App = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount
  const updatedAnno = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields /><annots><square page="0" rect="100,592,300,642" color="#000000" flags="print" name="0f08c438-d16f-f7cd-062b-de9265843ee3" title="Rahman" subject="Rectangle" date="D:20241112113649-05'00'" creationdate="D:20241112113649-05'00'"/><circle page="0" rect="415.02,353.61,585.26,557.23" color="#E44234" flags="print" name="c31d427f-1e61-bba1-61c7-948272925849" title="Rahman" subject="Ellipse" date="D:20241112113655-05'00'" creationdate="D:20241112113654-05'00'"/><circle page="0" rect="212.52,207.86,322.67,311.33" color="#E44234" flags="print" name="c93d2f87-a111-7f09-c5df-9838948e1ae8" title="Rahman" subject="Ellipse" date="D:20241112113655-05'00'" creationdate="D:20241112113655-05'00'"/></annots><pages><defmtx matrix="1,0,0,-1,0,792" /></pages></xfdf>`;

  useEffect(() => {
    // If you prefer to use the Iframe implementation, you can replace this line with: WebViewer.Iframe(...)

    WebViewer.WebComponent(
      {
        path: "/webviewer/lib",

        initialDoc: "/files/PDFTRON_about.pdf", // API url for getting file from API, from database.
        ui: "legacy",

        licenseKey:
          "demo:1731121654634:7efda14b0300000000d88442aeb7486771ed6c1b5dc3ea77601e2b2e98",
      },

      // linner doc streaming.

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

            // API call for saving xfdf;
          },
        });
      });
      documentViewer.setDocumentXFDFRetriever(async () => {
        // load the annotation data
        //const response = await fetch("path/to/annotation/server");
        //const xfdfString = await response.text();
        const xfdfString = updatedAnno;

        // <xfdf>
        // <annots>
        // <text subject="Comment" page="0" color="#FFE6A2" ... />
        // </annots>
        // </xfdf>
        return xfdfString;
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
