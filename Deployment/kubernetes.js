const k8s = require("@kubernetes/client-node");

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const deployApp = async () => {
  await createPod();
  await createService();
};

const createPod = async () => {
  const pod = {
    metadata: {
      name: "uploader-pod",
      labels: {
        app: "uploader",
      },
    },
    spec: {
      containers: [
        {
          name: "uploader-container",
          image: "prasannahares/uploader",
        },
      ],
    },
  };
  try {
    const createdPod = await k8sApi.createNamespacedPod("default", pod);
  } catch (err) {
    console.error(err);
  }
};

const createService = async () => {
  try {
    const uplservice = {
      metadata: {
        name: "uploader-service",
      },
      spec: {
        type: "LoadBalancer",
        selector: {
          app: "uploader",
        },
        ports: [
          { targetPort: 3000, port: 3000, protocol: "TCP", nodePort: 30007 },
        ],
      },
    };
    const servicecreation = await k8sApi.createNamespacedService(
      "default",
      uplservice
    );
  } catch (err) {
    console.log(err.message);
  }
};

deployApp();
