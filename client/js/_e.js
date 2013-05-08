//_e Module
(function()
{	
	var error	= "No error",
		types	= [],
		_eobj	= function(type)
		{
			this._emeta				= {};
			this._emeta[type]		= {};
			this._emeta._etype		= type;
			
			this.object_getBlob		= function() { return { _etype: this._emeta._etype }; };
			this.object_setBlob		= function() {};
			
			//post-constructor callback: _onBuilt. Only called if object adds it. Removed once called.
			this.is					= function(type) { return _e.hasBase(this, type); };
		}
	
	_e 			= function()
	{
		var args = Array.prototype.slice.call(arguments, 0); //Construct array object from arguments.
		var object;
		if (args.length > 0)
		{
			object = args[0];
			args.shift();
		}
		if (typeof object === "undefined")
			return _e.err("No object passed to _e()");
		if (object instanceof Function)
		{
			var arg = args.length > 0
						? args[0]
						: null;
			if (_e.isString(arg))
			{
				console.log("Registered " + arg);
				types[arg] = object;
			}
			else
				return _e.err("Type argument for _e([selector], [type]) must be a string.");
		}
		else if (_e.isString(object))
		{
			if (object.length === 0)
				return _e.err("Empty string passed to _e()");
				
			if (object in types)
				return _e.from(new _eobj(object), object, args);
			else
				return _e.err("Unknown type: " + object);
		}
		else
			return _e.err("Unknown object passed to _e()");
	};
	
	_e.err		= function (value)
	{
		console.log("Error: " + value);
		error = value;
		return false;
	};
	
	if (typeof window !== "undefined")
		window._e = _e;
	else if (typeof exports !== "undefined")
		exports._e = _e;
	
	_e.extend		= function(dest, src)
	{
		if (typeof src === "object" && src !== null)
		{
			for (var i in src)
				dest[i] = _e.clone(src[i]);
		}
		else
			dest = src;
			
		console.log(dest);
	   return dest;
	};
	
	_e.clone		= function(src) { return _e.extend({}, src); };
	
	_e.isDef		= function(object) { return typeof object !== "undefined"; };
	
	_e.hasBase		= function(object, basetype)
	{
		return typeof object !== "undefined"
			&& typeof object._emeta !== "undefined"
			&& basetype in object._emeta;
	};
	
	_e.isString		= function(object)
	{
		return object instanceof String
			|| typeof object === "string";
	};
	
	_e.escapeHTML	= function(html)
	{
		return String(html)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	};
	
	_e.from			= function(base, type, args)
	{
		if (type in types)
		{
			base._emeta[type] = {};
			
			var tmp = new _eobj(type);
			types[type].apply(tmp, args); //Pass each argument in args as an individual value.
			
			//Copy functions and public variables.
			for (var i in tmp)
			{
				if (i !== "_emeta" && i !== "is")
				{
					base[i] = tmp[i];
					if ((i.indexOf("_") === -1) && tmp[i] instanceof Function)
						base[type + "_" + i] = tmp[i];
				}
			}
			//Copy meta.
			for (var meta in tmp._emeta)
				base._emeta[meta] = tmp._emeta[meta];
				
			if (!("getBlob" in base))
				this.getBlob		= function() { return { _etype: this._emeta._etype }; };
			if (!("setBlob" in base))
				this.setBlob		= function(blob) {}; //Do nothing.
				
			//Set high type.
			base._emeta._etype = type;
			
			//Post-constructor callback.
			if ("_onBuilt" in base)
			{
				base._onBuilt();
				delete base["_onBuilt"]; //Remove it so future _e.from operations don't call it.
			}
			return base;
		}
		else
		{
			_e.err("Type is not registered: " + type);
			return base;
		}
	};
	
	//Note: only works if an object has a "high" type that sets up multiple bases.
	_e.fromBlob		= function(blob)
	{
		if ("_etype" in blob)
		{
			var res = _e(blob._etype);
			if (_e.isDef(res))
				res.setBlob(blob); //Dark sorcery. It should work if the object is initialized properly.
			else
				_e.err("Cannot generate object from blob: _etype \"" + blob._etype + "\" is not registered.");
				
			return res;
		}
		else
			_e.err("Cannot generate object from blob: Missing _etype.");
	}
	
	_e.getTime		= function() { return new Date().getTime(); }
	
	_e.timeDiff		= function(oldTime) { return (_e.getTime() - oldTime)*0.001; }
	
	return _e;
})();