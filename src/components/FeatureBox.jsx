// src/components/FeatureBox.jsx
export const FeatureBox = ({ icon, title, description }) => {
    return (
      <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-center text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    );
  };
  