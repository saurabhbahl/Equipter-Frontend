import { Link } from "react-router-dom";
export interface IBreadcrumb {
  label: string;
  link: string;
}
export interface BreadCrumpProps {
  breadcrumbs: IBreadcrumb[];
}
const BreadCrump = ({ breadcrumbs }: BreadCrumpProps) => {
  return (
    <nav className="flex space-x-2 text-sm text-gray-600">
      {breadcrumbs.map((crumb: IBreadcrumb, index) => (
        <div key={index} className="flex items-center">
          <Link
            to={`/admin${crumb.link}`}
            className="text-white hover:text-custom-orange transition-colors"
          >
            {crumb.label}
          </Link>
          {index < breadcrumbs.length - 1 && (
            <span className="ml-2 text-custom-orange">/</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default BreadCrump;
