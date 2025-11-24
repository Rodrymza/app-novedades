interface FieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const ProfileField = ({ label, value, icon }: FieldProps) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-2">
      {icon} {label}
    </p>
    <p className="text-base font-semibold text-gray-800">{value}</p>
  </div>
);

export default ProfileField;
