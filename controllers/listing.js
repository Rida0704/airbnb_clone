const Listing=require("../models/listing");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>
    {
        const alllistings=await Listing.find({});
        res.render("listings/index", { alllistings });
    
    };

    module.exports.renderNewForm=(req,res)=>{
   
        res.render("listings/new.ejs");
        };

        module.exports.showListing=async (req, res) => {
            let { id } = req.params;
            const listing = await Listing.findById(id)
            .populate({
                path:"reviews",
                populate:{
                    path:"author",
                },
            })
            .populate("owner");
            if (!listing) {
                req.flash("error", "Listing does not exist");
                return res.redirect("/listings");  // ✅ ADD return here
            }
            const coordinates = listing.location?.coordinates || [0, 0];
            console.log("Listing Location:", listing.location);

            res.render("listings/show", { listing, currUser: req.user, mapToken });

    
        };

        exports.createListing = async (req, res) => {
            let response= await geocodingClient.forwardGeocode({
                query: req.body.listing.location,
                limit: 1
              })
                .send()
              console.log("Geocoding full response:", response.body);
              console.log("Coordinates received:", response.body.features[0]?.geometry?.coordinates);
            
            let url=req.file.path;
            let filename=req.file.filename;
    
            const newListing = new Listing(req.body.listing);
            newListing.owner=req.user._id;
            newListing.image={url,filename};
            const geoData = response.body.features[0];
            newListing.geometry = {
                type: "Point",
                coordinates: geoData.geometry.coordinates,
                name: geoData.place_name
              };
              
              

            

            let savedlisting=await newListing.save();
            console.log(savedlisting);
            req.flash("success", "New listing created!");
            res.redirect(`/listings/${savedlisting._id}`);

        };
        
          

        module.exports.renderEditForm=async (req, res) => {
            let { id } = req.params;
            const listing = await Listing.findById(id);
            if (!listing) {
                req.flash("error", "Listing does not exist");
                return res.redirect("/listings");  // ✅ ADD return here too
            }
            let originalImageUrl=listing.image.url;
            originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
            res.render("listings/edit.ejs", { listing,originalImageUrl});
        };

        module.exports.updateListing=async(req,res)=>
            {  
                let{id}=req.params;
                
                let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
                if(typeof req.file!=undefined)
                {
                let url=req.file.path;
                let filename=req.file.filename;
                listing.image={url,filename};
                await listing.save();
                req.flash("success","Listing updated");
                res.redirect(`/listings/${id}`);
                res.redirect(`/listings/${id}`);

                }
            };
            module.exports.destroyListing=async(req,res)=>{
                let {id}=req.params;
                let deletedlisting=await Listing.findByIdAndDelete(id);
                console.log(deletedlisting);
                req.flash("success","Listing deleted");
                res.redirect("/listings");
            };