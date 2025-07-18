import React from "react";

export default function AuthorCard({ name = "Admin", bio, avatar }) {
  return (
    <div className="flex gap-4 items-center p-4 border rounded shadow-sm mt-16">
      <img
        src={avatar || "/default-avatar.png"}
        alt={name}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div>
        <h4 className="font-semibold text-lg">{name}</h4>
        <p className="text-sm text-gray-600">{bio || "No author bio provided."}</p>
      </div>
    </div>
  );
}
