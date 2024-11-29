import React from "react";
import { Helmet } from "react-helmet-async";

interface MetaComponentProps {
  title: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
}

const MetaComponent: React.FC<MetaComponentProps> = ({
  title="Equipter",
  description,
  keywords = "",
  canonicalUrl = window.location.href,
}) => {
  return (
    <Helmet>
      <title className="capitalize">{title} | Equipter  </title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />

      
    </Helmet>
  );
};

export default MetaComponent;
