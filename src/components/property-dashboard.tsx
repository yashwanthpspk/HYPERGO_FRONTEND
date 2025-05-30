import React from "react";
import { 
  Card, 
  CardBody, 
  Input, 
  Button, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Checkbox
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { PropertyDetails } from "./property-details";
import { EditProperty } from "./edit-property";
import { Property } from "../types/property";

interface PropertyDashboardProps {
  properties: Property[];
}

export const PropertyDashboard = ({ properties }: PropertyDashboardProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);
  const [filteredProperties, setFilteredProperties] = React.useState<Property[]>(properties);
  const [viewMode, setViewMode] = React.useState<"view" | "edit" | null>(null);
  const [propertyTypeFilter, setPropertyTypeFilter] = React.useState<string>("all");
  const [priceRange, setPriceRange] = React.useState<{min: number, max: number}>({
    min: 0,
    max: 50000000
  });
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);
  const [listingTypeFilter, setListingTypeFilter] = React.useState<string>("all");
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rowsPerPage = 10;
  
  // Get unique property types
  const propertyTypes = React.useMemo(() => {
    const types = new Set(properties.map(p => p.type));
    return Array.from(types);
  }, [properties]);
  
  // Get unique amenities
  const amenities = React.useMemo(() => {
    const amenitiesSet = new Set<string>();
    properties.forEach(property => {
      if (property.amenities) {
        const amenitiesList = property.amenities.split('|');
        amenitiesList.forEach(amenity => amenitiesSet.add(amenity));
      }
    });
    return Array.from(amenitiesSet).sort();
  }, [properties]);
  
  // Filter properties based on search query and filters
  React.useEffect(() => {
    let filtered = properties;
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.state?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Property type filter
    if (propertyTypeFilter !== "all") {
      filtered = filtered.filter(property => property.type === propertyTypeFilter);
    }
    
    // Price range filter
    filtered = filtered.filter(property => 
      property.price >= priceRange.min && property.price <= priceRange.max
    );
    
    // Amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(property => {
        if (!property.amenities) return false;
        const propertyAmenities = property.amenities.split('|');
        return selectedAmenities.every(amenity => propertyAmenities.includes(amenity));
      });
    }
    
    // Listing type filter
    if (listingTypeFilter !== "all") {
      filtered = filtered.filter(property => property.listingType === listingTypeFilter);
    }
    
    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, properties, propertyTypeFilter, priceRange, selectedAmenities, listingTypeFilter]);
  
  // Calculate pagination
  const pages = Math.ceil(filteredProperties.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedProperties = filteredProperties.slice(start, end);
  
  const handlePropertyAction = (property: Property, action: "view" | "edit" | "delete") => {
    setSelectedProperty(property);
    
    if (action === "delete") {
      onOpen();
    } else {
      setViewMode(action);
      onOpen();
    }
  };
  
  const handleDeleteProperty = () => {
    if (selectedProperty) {
      // In a real app, this would make an API call
      const updatedProperties = filteredProperties.filter(p => p.id !== selectedProperty.id);
      setFilteredProperties(updatedProperties);
      onClose();
    }
  };
  
  const handleAmenityChange = (amenity: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedAmenities(prev => [...prev, amenity]);
    } else {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    }
  };
  
  const resetFilters = () => {
    setSearchQuery("");
    setPropertyTypeFilter("all");
    setPriceRange({ min: 0, max: 50000000 });
    setSelectedAmenities([]);
    setListingTypeFilter("all");
  };
  
  const renderPropertyStatus = (status: string) => {
    let color;
    switch (status.toLowerCase()) {
      case "available":
        color = "success";
        break;
      case "sold":
        color = "danger";
        break;
      case "pending":
        color = "warning";
        break;
      default:
        color = "default";
    }
    
    return <Chip color={color} size="sm" variant="flat">{status}</Chip>;
  };
  
  const renderVerifiedStatus = (isVerified: boolean) => {
    return isVerified ? 
      <Chip color="success" size="sm" variant="flat" startContent={<Icon icon="lucide:check" className="text-xs" />}>Verified</Chip> :
      <Chip color="default" size="sm" variant="flat">Not Verified</Chip>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <Input
              isClearable
              placeholder="Search properties..."
              startContent={<Icon icon="lucide:search" className="text-default-400" />}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="w-full sm:max-w-xs"
            />
            <Button 
              color="primary" 
              startContent={<Icon icon="lucide:filter" />}
              onPress={() => document.getElementById('filters')?.classList.toggle('hidden')}
            >
              Filters
            </Button>
          </div>
          
          <div id="filters" className="hidden mb-6 border border-default-200 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Property Type"
                placeholder="Select property type"
                selectedKeys={[propertyTypeFilter]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setPropertyTypeFilter(selected);
                }}
              >
                <SelectItem key="all" value="all">All Types</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
              
              <div>
                <label className="block text-small font-medium mb-1.5">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min.toString()}
                    onValueChange={(value) => setPriceRange(prev => ({...prev, min: Number(value) || 0}))}
                    startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">₹</span></div>}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max.toString()}
                    onValueChange={(value) => setPriceRange(prev => ({...prev, max: Number(value) || 50000000}))}
                    startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">₹</span></div>}
                  />
                </div>
              </div>
              
              <Select
                label="Listing Type"
                placeholder="Select listing type"
                selectedKeys={[listingTypeFilter]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setListingTypeFilter(selected);
                }}
              >
                <SelectItem key="all" value="all">All Listings</SelectItem>
                <SelectItem key="rent" value="rent">For Rent</SelectItem>
                <SelectItem key="sale" value="sale">For Sale</SelectItem>
              </Select>
            </div>
            
            <div>
              <p className="text-small font-medium mb-2">Amenities</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {amenities.slice(0, 12).map((amenity) => (
                  <Checkbox
                    key={amenity}
                    size="sm"
                    isSelected={selectedAmenities.includes(amenity)}
                    onValueChange={(isSelected) => handleAmenityChange(amenity, isSelected)}
                  >
                    {amenity}
                  </Checkbox>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="flat"
                color="danger"
                onPress={resetFilters}
                startContent={<Icon icon="lucide:x" />}
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          <div className="mb-4 flex justify-between items-center">
            <p className="text-default-500 text-small">
              Showing {filteredProperties.length > 0 ? start + 1 : 0}-{Math.min(end, filteredProperties.length)} of {filteredProperties.length} properties
            </p>
          </div>
          
          <Table 
            aria-label="Property listings table"
            removeWrapper
            bottomContent={
              pages > 1 ? (
                <div className="flex justify-center">
                  <Pagination
                    total={pages}
                    page={currentPage}
                    onChange={setCurrentPage}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn>PROPERTY</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>LOCATION</TableColumn>
              <TableColumn>DETAILS</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No properties found">
              {paginatedProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img 
                          src={`https://img.heroui.chat/image/places?w=100&h=100&u=${property.id}`} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{property.title}</p>
                        <p className="text-tiny text-default-500">{property.type} • {property.listingType === "rent" ? "For Rent" : "For Sale"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{property.price.toLocaleString()}</div>
                    <div className="text-tiny text-default-500">
                      {property.rating && <span>Rating: {property.rating}⭐</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{property.city}, {property.state}</div>
                    <div className="text-tiny text-default-500">{property.areaSqFt} sq.ft</div>
                  </TableCell>
                  <TableCell>
                    <div>{property.bedrooms} beds • {property.bathrooms} baths</div>
                    <div className="text-tiny text-default-500">{property.furnished}</div>
                  </TableCell>
                  <TableCell>
                    {property.isVerified !== undefined && renderVerifiedStatus(property.isVerified)}
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <Icon icon="lucide:more-vertical" className="text-default-500" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Property actions">
                        <DropdownItem 
                          startContent={<Icon icon="lucide:eye" />}
                          onPress={() => handlePropertyAction(property, "view")}
                        >
                          View Details
                        </DropdownItem>
                        <DropdownItem 
                          startContent={<Icon icon="lucide:edit" />}
                          onPress={() => handlePropertyAction(property, "edit")}
                        >
                          Edit Property
                        </DropdownItem>
                        <DropdownItem 
                          startContent={<Icon icon="lucide:trash-2" />} 
                          className="text-danger"
                          onPress={() => handlePropertyAction(property, "delete")}
                        >
                          Delete Property
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      
      {/* Property Details/Edit Modal */}
      <Modal 
        isOpen={isOpen && viewMode !== null} 
        onClose={() => {
          onClose();
          setViewMode(null);
        }}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {viewMode === "view" ? "Property Details" : "Edit Property"}
              </ModalHeader>
              <ModalBody>
                {viewMode === "view" && selectedProperty && (
                  <PropertyDetails property={selectedProperty} />
                )}
                {viewMode === "edit" && selectedProperty && (
                  <EditProperty 
                    property={selectedProperty} 
                    onSave={() => {
                      // In a real app, this would update the property
                      onClose();
                    }}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Close
                </Button>
                {viewMode === "edit" && (
                  <Button color="primary" onPress={onClose}>
                    Save Changes
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen && viewMode === null} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm Deletion</ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete the property "{selectedProperty?.title}"? 
                  This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={handleDeleteProperty}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};