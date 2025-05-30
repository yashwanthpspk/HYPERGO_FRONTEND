import React from "react";
import { Chip, Divider, Badge } from "@heroui/react";
import { Property } from "../types/property";
import { Icon } from "@iconify/react";

interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  // Generate a style object for the color theme if available
  const colorStyle = property.colorTheme ? {
    backgroundColor: `${property.colorTheme}10`, // Using the color with low opacity
    borderColor: property.colorTheme,
    color: property.colorTheme
  } : {};

  return (
    <div className="space-y-6">
      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <img 
          src={`https://img.hypergo.chat/image/places?w=800&h=400&u=${property.id}`} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">{property.title}</h2>
          <p className="text-default-500">{property.city}, {property.state}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold">₹{property.price.toLocaleString()}</span>
          <Chip color={property.listingType === "rent" ? "primary" : "success"} size="sm" variant="flat">
            {property.listingType === "rent" ? "For Rent" : "For Sale"}
          </Chip>
        </div>
      </div>
      
      <Divider />
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <span className="text-default-500 text-sm">Type</span>
          <span className="font-medium">{property.type}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-default-500 text-sm">Bedrooms</span>
          <span className="font-medium">{property.bedrooms}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-default-500 text-sm">Bathrooms</span>
          <span className="font-medium">{property.bathrooms}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-default-500 text-sm">Area</span>
          <span className="font-medium">{property.areaSqFt} sq ft</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <span className="text-default-500 text-sm">Furnished</span>
          <span className="font-medium">{property.furnished}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-default-500 text-sm">Available From</span>
          <span className="font-medium">{property.availableFrom}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-default-500 text-sm">Listed By</span>
          <span className="font-medium">{property.listedBy}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-default-500 text-sm">Rating</span>
          <span className="font-medium flex items-center gap-1">
            {property.rating} 
            <Icon icon="lucide:star" className="text-warning" />
          </span>
        </div>
      </div>
      
      {property.isVerified !== undefined && (
        <div className="flex items-center gap-2">
          <Badge color={property.isVerified ? "success" : "default"} content={property.isVerified ? "✓" : "✗"}>
            <span className="font-medium">{property.isVerified ? "Verified Property" : "Not Verified"}</span>
          </Badge>
        </div>
      )}
      
      {property.description && (
        <div>
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-default-600">{property.description}</p>
        </div>
      )}
      
      {property.amenities && (
        <div>
          <h3 className="text-lg font-medium mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {property.amenities.split('|').map((amenity, index) => (
              <Chip key={index} variant="flat" size="sm" style={colorStyle}>{amenity}</Chip>
            ))}
          </div>
        </div>
      )}
      
      {property.tags && (
        <div>
          <h3 className="text-lg font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {property.tags.split('|').map((tag, index) => (
              <Chip key={index} variant="flat" size="sm" color="secondary">{tag.replace(/-/g, ' ')}</Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};