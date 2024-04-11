import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://wwxlvnmsueppjrtkhqdv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eGx2bm1zdWVwcGpydGtocWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIwNDk3NjYsImV4cCI6MjAyNzYyNTc2Nn0._7cfgLV7yV4-bWYsGqv59mcG52fbj0tr6Q4eoVNuNc0";
const supabase = createClient(supabaseUrl, supabaseKey);

const DModeButton = document.getElementById("DarkModeButton");
DModeButton.addEventListener("click", DModeToggle);

function DModeToggle()
{
    //Function alters values in the CSS, so need a reference to it.
    let doc = document.querySelector(":root");
    let docStyle = getComputedStyle(doc);
    let currLDMode = docStyle.getPropertyValue("--LD");
    if(currLDMode === "L")
    {
        doc.style.setProperty("--backgroundColor", "navy");
        doc.style.setProperty("--textColor", "grey");
        doc.style.setProperty("--boxBackgroundColor", "black");
        doc.style.setProperty("--boxBorderColor", "grey");
        doc.style.setProperty("--LD", "D");
    }
    else //Site defaults to light mode
    {
        doc.style.setProperty("--backgroundColor", "aliceBlue");
        doc.style.setProperty("--textColor", "white");
        doc.style.setProperty("--boxBackgroundColor", "blue");
        doc.style.setProperty("--boxBorderColor", "lightblue");
        doc.style.setProperty("--LD", "L");
    }
}

function ClearResponses()
{
    let prevSearchResults = document.getElementsByClassName('SearchResult');
    
    while(prevSearchResults[0])
    {
        prevSearchResults[0].parentNode.removeChild(prevSearchResults[0]);
    }
}

function ShowResponses(text)
{
    let paragraph = document.createElement("p");
    let section = document.getElementById("MainSection");
    paragraph.classList.add("SearchResult");
    //Dynamically-created element, so will be easier to define its CSS properties here.
    paragraph.setAttribute('style', 'white-space: pre;'); 
    paragraph.textContent = text;
    section.appendChild(paragraph);  
}

const searchBox = document.getElementById("SearchTermBox");
const PeopleSearchButton = document.getElementById("PeopleSearchButton");
if(PeopleSearchButton)
{
    PeopleSearchButton.addEventListener("click", SearchForPerson);  

}

function SearchForPerson() 
{
    let input = searchBox.value;
    if(input && /(\w+)(\s?\w+)*/.test(input))
    {
        let people;
        let dbResult = GetPeople(input);
        dbResult.then((data, error) =>
        {
            if(!error && data)
            {
                
                ClearResponses();
                people = data
                console.log(people);
                let list = `Matches:\r\n\r\n`;

                for(let i = 0; i < people.length; i++)
                {
                    list = list + `Name: ${people[i].Name}\r\nAddress: ${people[i].Address}\r\nDOB: ${people[i].DOB}\r\nLicense Number: ${people[i].LicenseNumber}\r\nExpiry Date: ${people[i].ExpiryDate}\r\n\r\n`;
                }

                if(people.length === 0)
                {
                    list = list + "No matches found in name or license number.\r\n";
                }
                
                ShowResponses(list);
            }
            else
            {
                ShowResponses("There was an error accessing the database.\r\n");
            }
        });
        
    }
}

async function GetPeople(input)
{
    const { data, error } = await supabase.from("People").select("*").or(`Name.ilike.%${input}%,LicenseNumber.eq.${input}`);
    return data;
}

const VehicleSearchButton = document.getElementById("VehicleSearchButton");
if(VehicleSearchButton)
{
    VehicleSearchButton.addEventListener("click", SearchForVehicle);
}

function SearchForVehicle() 
{
    let input = searchBox.value;
    if(input && /\w+/.test(input))
    {
        let vehicles;
        let dbResult = GetVehicles(input);
        let section = document.getElementById("MainSection");
        dbResult.then((data, error) =>
        {
            if(!error && data)
            {
                let prevSearchResults = document.getElementsByClassName('SearchResult');

                while(prevSearchResults[0]) {
                    prevSearchResults[0].parentNode.removeChild(prevSearchResults[0]);
                }

                vehicles = data
                console.log(vehicles);
                let list = `Matches:\r\n\r\n`;

                for(let i = 0; i < vehicles.length; i++)
                {
                    if(!vehicles[i].Make)
                        {
                            vehicles[i].Make = "Unknown";
                        }
                        if(!vehicles[i].Model)
                        {
                            vehicles[i].Model = "Unknown";
                        }
                        if(!vehicles[i].Colour)
                        {
                            vehicles[i].Colour = "Unknown";
                        }
                        if(vehicles[i].People)
                        {
                            if(!vehicles[i].People.Name)
                            {
                                vehicles[i].People.Name = "Unknown";
                            }
                            if(!vehicles[i].People.LicenseNumber)
                            {
                                vehicles[i].People.LicenseNumber = "Unknown";
                            }
                            list = list + `License Plate: ${vehicles[i].VehicleID}\r\nMake: ${vehicles[i].Make}\r\nModel: ${vehicles[i].Model}\r\nColour: ${vehicles[i].Colour}\r\nOwner Name: ${vehicles[i].People.Name}\r\nOwner License Number: ${vehicles[i].People.LicenseNumber}\r\n\r\n`;
                        }
                        else
                        {
                            list = list + `License Plate: ${vehicles[i].VehicleID}\r\nMake: ${vehicles[i].Make}\r\nModel: ${vehicles[i].Model}\r\nColour: ${vehicles[i].Colour}\r\nOwner Name: Unknown\r\nOwner License Number: Unknown\r\n\r\n`;
                        }
                }
                if(vehicles.length === 0)
                {
                    list = list + "No matches found.\r\n";
                }
                
                ShowResponses(list);
            }
            else
            {
                ShowResponses("There was an error accessing the database.\r\n");
            }
        });
        
    }
}

async function GetVehicles(input)
{
    const { data, error } = await supabase.from("Vehicles").select("*, People:OwnerID (Name, LicenseNumber)").ilike("VehicleID",`%${input}%`);
    return data;
}

const VehicleRegistrationForm = document.getElementById("RegistrationForm");
if(VehicleRegistrationForm)
{
    VehicleRegistrationForm.addEventListener("submit", RegisterVehicle);
}

const VehicleLPBox = document.getElementById("VehicleLPBox");
if(VehicleLPBox)
{
    VehicleLPBox.addEventListener("change", LPChanged);
}
const VehicleMakeBox = document.getElementById("VehicleMakeBox");
const VehicleModelBox = document.getElementById("VehicleModelBox");
const VehicleColourBox = document.getElementById("VehicleColourBox");

const OwnerNameBox = document.getElementById("OwnerNameBox");
if(OwnerNameBox)
{
    OwnerNameBox.addEventListener("change", OwnerNameChanged);
}
const OwnerAddressBox = document.getElementById("OwnerAddressBox");
const OwnerDOBBox = document.getElementById("OwnerDOBBox");
const OwnerLNBox = document.getElementById("OwnerLNBox");
const OwnerEDBox = document.getElementById("OwnerEDBox");

function RegisterVehicle()
{
    let licensePlate = VehicleLPBox.value;
    let make = VehicleMakeBox.value;
    let model = VehicleModelBox.value;
    let colour = VehicleColourBox.value;

    let name = OwnerNameBox.value;
    let address = OwnerAddressBox.value;
    let dob = OwnerDOBBox.value;
    let licenseNumber = OwnerLNBox.value;
    let expiryDate = OwnerEDBox.value;

    //The date regex will accept some impossible dates, like the 30th of February.
    if((licensePlate && /\w+/.test(licensePlate)) &&
        (make && /(\w+)(\s?\w+)*/.test(make)) &&
        (model && /(\w+)(\s?\w+)*/.test(model)) &&
        (colour && /(\w+)(\s?\w+)*/.test(colour)) &&
        (name && /(\w+)(\s?\w+)*/.test(name)) &&
        (dob && /[0-9]{4}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/.test(dob)) &&
        (licenseNumber && /\w+/.test(licenseNumber)) &&
        (expiryDate && /[0-9]{4}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/.test(expiryDate)) &&
        (document.getElementById("LPExistsPara").hidden))
    {
        ClearResponses();
        let owner = CheckOwnerExists(OwnerNameBox.value);
        owner.then((data, error) => 
        {
            if(!error && data)
            {
                if(data.length > 0)
                {
                    let successful = UpdatePeople(name, address, dob, licenseNumber, expiryDate);
                    successful.then((error) => 
                    {
                        if(error)
                        {
                            ShowResponses("There was an error writing to the database. Please try again.");
                            return;
                        }
                        let successful = InsertVehicle(licensePlate, make, model, colour, name);
                        successful.then((error) => 
                            {
                                if(error)
                                {
                                    ShowResponses("There was an error writing to the database. Please try again.");
                                }
                                else
                                {
                                    ShowResponses("Vehicle successfully registered.");
                                }
                            });
                    });
                }
                else
                {
                    let successful = InsertPerson(name, address, dob, licenseNumber, expiryDate);
                    successful.then((error) => 
                    {
                        if(error)
                        {
                            ShowResponses("There was an error writing to the database. Please try again.");
                            return;
                        }
                        let successful = InsertVehicle(licensePlate, make, model, colour, name);
                        successful.then((error) => 
                            {
                                if(error)
                                {
                                    ShowResponses("There was an error writing to the database. Please try again.");
                                }
                                else
                                {
                                    ShowResponses("Vehicle successfully registered, owner added to database.");
                                }
                            });
                    });
                }
            }
            
        });
    }
    else
    {
        ClearResponses();
        ShowResponses("One or more fields were left empty, had an invalid format, or you are trying to register a license plate that is already registered.\r\n")
    }
}

function OwnerNameChanged()
{
    let person = CheckOwnerExists(OwnerNameBox.value);
    person.then((data, error) =>
    {
        if(!error && data) 
        {
            if(data.length > 0)
            {
                document.getElementById("OwnerInformationPara").hidden = true;
                document.getElementById("OwnerAddressBox").type = "hidden";
                document.getElementById("OwnerAddressBox").value = data[0].Address;
                document.getElementById("OwnerAddressLabel").hidden = true;
                document.getElementById("OwnerAddressBox").hidden = true;
                document.getElementById("OwnerDOBBox").type = "hidden";
                document.getElementById("OwnerDOBBox").value = data[0].DOB;
                document.getElementById("OwnerDOBLabel").hidden = true;
                document.getElementById("OwnerDOBBox").hidden = true;
                document.getElementById("OwnerLNBox").type = "hidden";
                document.getElementById("OwnerLNBox").value = data[0].LicenseNumber;
                document.getElementById("OwnerLNLabel").hidden = true;
                document.getElementById("OwnerLNBox").hidden = true;
                document.getElementById("OwnerEDBox").type = "hidden";
                document.getElementById("OwnerEDBox").value = data[0].ExpiryDate;
                document.getElementById("OwnerEDLabel").hidden = true;
                document.getElementById("OwnerEDBox").hidden = true;
            }
            else
            {
                document.getElementById("OwnerInformationPara").hidden = false;
                document.getElementById("OwnerAddressBox").type = "text";
                document.getElementById("OwnerAddressBox").value = "";
                document.getElementById("OwnerAddressLabel").hidden = false;
                document.getElementById("OwnerAddressBox").hidden = false;
                document.getElementById("OwnerDOBBox").type = "text";
                document.getElementById("OwnerDOBBox").value = "";
                document.getElementById("OwnerDOBLabel").hidden = false;
                document.getElementById("OwnerDOBBox").hidden = false;
                document.getElementById("OwnerLNBox").type = "text";
                document.getElementById("OwnerLNBox").value = "";
                document.getElementById("OwnerLNLabel").hidden = false;
                document.getElementById("OwnerLNBox").hidden = false;
                document.getElementById("OwnerEDBox").type = "text";
                document.getElementById("OwnerEDBox").value = "";
                document.getElementById("OwnerEDLabel").hidden = false;
                document.getElementById("OwnerEDBox").hidden = false;
            }
        }
    });
}

async function CheckOwnerExists(input)
{
    const { data, error } = await supabase.from("People").select("*").eq('Name',`${input}`);
    return data;
}

function LPChanged()
{
    let vehicle = CheckForLP(VehicleLPBox.value);
    vehicle.then((data, error) =>
    {
        if(!error && data) 
        {
            if(data.length > 0)
            {
                document.getElementById("LPExistsPara").hidden = false;
            }
            else
            {
                document.getElementById("LPExistsPara").hidden = true;
            }
        }
    });
}

async function CheckForLP(input)
{
    const { data, error } = await supabase.from("Vehicles").select("*").eq('VehicleID',`${input}`);
    return data;
}

async function UpdatePeople(name, address, dob, licenseNumber, expiryDate)
{
    const { error } = await supabase.from("People").update({Address: address, DOB: dob, LicenseNumber: licenseNumber, ExpiryDate: expiryDate}).eq('Name', `${name}`);
    return error;
}

async function InsertPerson(name, address, dob, licenseNumber, expiryDate)
{
    const { error } = await supabase.from("People").insert([{Name: name, Address: address, DOB: dob, LicenseNumber: licenseNumber, ExpiryDate: expiryDate}]);
    return error;
}

async function InsertVehicle(licensePlate, make, model, colour, name)
{
    let ownerID = GetIDFromName(name);
    let owner;
    ownerID.then(async (data, error) => 
        {
            if(!error && data)
            {
                owner = data[0].PersonID;
                const { error } = await supabase.from("Vehicles").insert([{VehicleID: licensePlate, Make: make, Model: model, Colour: colour, OwnerID: owner}]);
                return error;
            }
        });
}

async function GetIDFromName(name)
{
    const {data, error} = await supabase.from("People").select("PersonID").eq('Name',`${name}`);
    return data;
}

////////// TESTS FOR REQUIREMENT 3 //////////

// Apparently, to access local files with playwright, I have to write the
// absolute file path, so these will almost not certainly work when the
// CW is submitted. Sorry!

/*import { test, expect } from '@playwright/test';

test('Works for existing owner', async ({page}) =>
{
    await page.goto("file://C:/Users/brekt/OneDrive/Documents/COMP1004/CW2/vehicleRegister.html");
});*/
