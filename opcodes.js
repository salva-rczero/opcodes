$(function() {
	console.time('load');
	var optab = $('#optab'),
		csvdata,
		cacheData = [];
	var flags = new Map([
		["$","Causes serialization"],
		["A","Access exceptions for logical addresses"],
		["A*","Access exceptions for logical addresses. The optional asterisk indicates that a PER ZAD event is not recognized"],
		["A1","Access exceptions; not all access exceptions may occur; see instruction description for details"],
		["A1*","Access exceptions; not all access exceptions may occur; see instruction description for details. The optional asterisk indicates that a PER ZAD event is not recognized"],
		["AI","Access exceptions for instruction address"],
		["B","PER branch event. (For LGG and LLGFSG, the PER branch event is only recognized coincident with a guarded-storage event.)"],
		["B+","B1 field designates an access register when bit 47 of GR0 is zero, and bits 16-17 of the current PSW are 01 binary; or when bit 47 of GR0 is one, and bits 40-41 of GR0 are 01 binary"],
		["B++","B2 field designates an access register when bit 63 of GR0 is zero, and bits 16-17 of the current PSW are 01 binary; or when bit 63 of GR0 is one, and bits 56-57 of GR0 are 01 binary"],
		["B1","B1 field designates an access register in the access-register mode"],
		["B2","B2 field designates an access register in the access-register mode"],
		["B4","B4 field designates an access register in the access-register mode"],
		["BP","B2 field designates an access register when PSW bits 16 and 17 have the value 01"],
		["C","Condition code is set"],
		["C*","Condition code is optionally set"],
		["C1","Condition code is set when the conditional-SSKE facility is installed, and either or both of the MR and MC bits are one"],
		["CS","Compare-and-swap-and-store facility"],
		["CT","Configuration-topology facility"],
		["CX","Constrained transactional-execution facility"],
		["D2","DAT-enhancement facility 2"],
		["DE","DAT-enhancement facility"],
		["DF","Decimal-overflow exception"],
		["DF*","Decimal-overflow exception conditionally recognized"],
		["DK","Decimal-divide exception"],
		["DM","Depending on the model, DIAGNOSE may generate various program exceptions and may change the condition code"],
		["DO","Distinct-operands facility"],
		["Da","AFP-register data exception"],
		["Db","BFP-instruction data exception"],
		["Dc","Compare-and-trap data exception"],
		["Dg","General-operand data exception"],
		["Dt","DFP-instruction data exception"],
		["Dv","Vector-instruction data exception"],
		["E","E instruction format"],
		["E2","Extended-translation facility 2"],
		["E3","Extended-translation facility 3"],
		["ED1","Enhanced-DAT facility 1"],
		["ED2","Enhanced-DAT facility 2"],
		["EH","Execution-hint facility"],
		["EI","Extended-immediate facility"],
		["EO","HFP-exponent-overflow exception"],
		["ES","Expanded-storage facility"],
		["ET","Extract-CPU-time facility"],
		["EU","HFP-exponent-underflow exception"],
		["EX","Execute exception"],
		["F","Floating-point-extension facility"],
		["FC","Designation of access registers depends on the function code of the instruction"],
		["FG","FPR-GR-transfer facility"],
		["FK","HFP-divide exception"],
		["FL","Store-facility-list-extended facility"],
		["FS","Floating-point-support-sign-handling facility"],
		["G0","Instruction execution includes the implied use of general register 0"],
		["G1","Instruction execution includes the implied use of general register 1"],
		["G2","Instruction execution includes the implied use of general register 2"],
		["G4","Instruction execution includes the implied use of general register 4"],
		["GE","General-instructions-extension facility"],
		["GF","Guarded-storage facility"],
		["GM","Instruction execution includes the implied use of multiple general registers"],
		["GS","Instruction execution includes the implied use of general register 1 as the subsystem-identification word"],
		["GZ","DEFLATE-conversion facility"],
		["HM","HFP-multiply-add/subtract facility"],
		["HW","High-word facility"],
		["I","I instruction format"],
		["I1","Access register 1 is implicitly designated in the access-register mode"],
		["I4","Access register 4 is implicitly designated in the access-register mode"],
		["IA","Interlocked-access facility"],
		["IC","Condition code alternative to interruptible instruction"],
		["IE","IE instruction format"],
		["IF","Fixed-point-overflow exception"],
		["IF*","Fixed-point-overflow exception conditionally recognized"],
		["II","Interruptible instruction"],
		["IK","Fixed-point-divide exception"],
		["IM","Insert-reference-bits-multiple facility"],
		["K","PER storage-key-alteration event"],
		["L","New condition code is loaded"],
		["L1","Load/store-on-condition facility 1"],
		["L2","Load/store-on-condition facility 2"],
		["LD","Long-displacement facility"],
		["LS","HFP-significance exception"],
		["LT","Load-and-trap facility"],
		["LZ","Load-and-zero-rightmost-byte facility"],
		["M3","Message-security assist extension 3"],
		["M4","Message-security assist extension 4"],
		["M5","Message-security assist extension 5"],
		["M8","Message-security assist extension 8"],
		["M9","Message-security assist extension 9"],
		["MD","Designation of access registers in the access-register mode is model-dependent"],
		["ME","Monitor event"],
		["MI1","Miscellaneous-instruction-extensions facility 1"],
		["MI2","Miscellaneous-instruction-extensions facility 2"],
		["MI3","Miscellaneous-instruction-extensions facility 3"],
		["MII","MII instruction format"],
		["MO","Move-with-optional-specifications facility"],
		["MS","Message-security assist"],
		["N","Instruction is new in z/Architecture as compared to ESA/390"],
		["N3","Instruction is new in z/Architecture and has been added to ESA/390"],
		["OP","Operand exception"],
		["P","Privileged-operation exception; also, restricted from transactional execution"],
		["PA","Processor-assist facility"],
		["PC","DFP packed-conversion facility"],
		["PE","Parsing-enhancement facility"],
		["PF","PFPO facility"],
		["PK","Population-count facility"],
		["Q","Privileged-operation exception for semiprivileged instructions; also, restricted from transactional execution"],
		["R1","R1 field designates an access register in the access-register mode"],
		["R2","R2 field designates an access register in the access-register mode"],
		["R3","R3 field designates an access register in the access-register mode"],
		["RA","Reusable-ASN-and-LX facility"],
		["RB","Reset-reference-bits-multiple facility"],
		["RI","RI instruction format"],
		["RIE","RIE instruction format"],
		["RIL","RIL instruction format"],
		["RIS","RIS instruction format"],
		["RM","R1 field designates an access register in the access-register mode, and access-register 1 also is used in the access-register mode"],
		["RR","RR instruction format"],
		["RRD","RRD instruction format"],
		["RRE","RRE instruction format"],
		["RRF","RRF instruction format"],
		["RRS","RRS instruction format"],
		["RS","RS instruction format"],
		["RSI","RSI instruction format"],
		["RSL","RSL instruction format"],
		["RSY","RSY instruction format"],
		["RX","RX instruction format"],
		["RXE","RXE instruction format"],
		["RXF","RXF instruction format"],
		["RXY","RXY instruction format"],
		["S","S instruction format"],
		["SC","Store-clock-fast facility"],
		["SE","Special operation, stack-empty, stack-specification, and stack-type exceptions"],
		["SF","Special-operation, stack-full, and stack-specification exceptions"],
		["SI","SI instruction format"],
		["SIL","SIL instruction format"],
		["SIY","SIY instruction format"],
		["SMI","SMI instruction format"],
		["SO","Special-operation exception"],
		["SP","Specification exception"],
		["SQ","HFP-square-root exception"],
		["SS","SS instruction format"],
		["SSE","SSE instruction format"],
		["SSF","SSF instruction format"],
		["ST","PER storage-alteration event. (For LGG and LLGFSG, the PER storage-alteration event is only recognized coincident with a guarded-storage event.)"],
		["SU","PER store-using-real-address event"],
		["SW","Special-operation exception and space-switch event"],
		["T","Trace exceptions (which include trace table, addressing, and low-address protection)"],
		["TE","Test-pending-external-interruption facility"],
		["TF","Decimal-floating-point facility"],
		["TR","Decimal-floating-point-rounding facility"],
		["TS","TOD-clock-steering facility"],
		["TX","Transactional-execution facility"],
		["U","Condition code is unpredictable"],
		["U1","R1 field designates an access register unconditionally"],
		["U2","R2 field designates an access register unconditionally"],
		["UB","R1 and R3 fields designate access registers unconditionally, and B2 field designates an access register in the access-register mode"],
		["UE","HFP unnormalized-extensions facility"],
		["V1","Vector-enhancements facility 1"],
		["V2","Vector-enhancements facility 2"],
		["VD","Vector packed-decimal facility"],
		["VF","Vector facility for z/Architecture"],
		["VRI","VRI instruction format"],
		["VRR","VRR instruction format"],
		["VRS","VRS instruction format"],
		["VRV","VRV instruction format"],
		["VRX","VRX instruction format"],
		["VSI","VSI instruction format"],
		["WE","Space-switch event"],
		["XF","IEEE-exception-simulation facility"],
		["XX","Execute-extension facility"],
		["Xg","Simulated IEEE exception"],
		["Xi","IEEE invalid-operation data or vector-processing exception"],
		["Xo","IEEE overflow data or vector-processing exception"],
		["Xq","Quantum data exception (if the floating-point extension facility is installed)"],
		["Xu","IEEE underflow data or vector-processing exception"],
		["Xx","IEEE inexact data or vector-processing exception"],
		["Xz","IEEE division-by-zero data or vector-processing exception"],
		["Z1","Additional exceptions and events for PROGRAM CALL (which include ASX-translation, EX-translation, LX-translation, PC-translation-specification, special-operation, stackfull, and stack-specification exceptions and space-switch event)"],
		["Z2","Additional exceptions and events for PROGRAM TRANSFER (which include AFX-translation, ASX-translation, primary-authority, and special-operation exceptions and space-switch event)"],
		["Z3","Additional exceptions for SET SECONDARY ASN (which include AFX translation, ASX translation, secondary authority, and special operation)"],
		["Z4","Additional exceptions and events for PROGRAM RETURN (which include AFX-translation, ASX-translation, secondary-authority, special-operation, stack-empty, stack-operation, stack-specification, and stack-type exceptions and space-switch event)"],
		["Z5","Additional exceptions for BRANCH AND STACK (which include special operation, stack full, and stack specification)"],
		["Z6","Additional exceptions and events for PROGRAM TRANSFER WITH INSTANCE (which include AFX-translation, ASTE-instance, ASX-translation, primary-authority, special-operation, and subspace-replacement exceptions and space-switch event)"],
		["Z7","Additional exceptions for SET SECONDARY ASN WITH INSTANCE (which include AFX translation, ASTE instance, ASX translation, secondary authority, special operation, and subspace replacement)"],
		["ZF","Decimal-floating-point-zoned-conversion facility"],
		["¢","Causes serialization and checkpoint synchronization"],
		["¢1","Causes serialization and checkpoint synchronization when the M1 and R2 fields contain 1111 binary and 0000 binary, respectively. Causes only serialization when the fast-BCR-serialization facility is installed,and the M1 and R2 fields contain 1110 binary and 0000 binary, respectively"],
		["¢2","Causes serialization and checkpoint synchronization when the state entry to be unstacked is a program-call state entry"],
		["¢3","Causes serialization and checkpoint synchronization when the set-key control is one"],
		["¢4","Causes serialization and checkpoint synchronization when the KFC value is 4 or 5"],
		["£","Causes specific-operand serialization"],
		["£1","Causes specific-operand serialization when the interlocked-access facility 1 is installed and the storage operand is aligned on an integral boundary corresponding to its size"],
		["£2","Causes specific-operand serialization when the interlocked-access facility 2 is installed"],
		["¤1","restricted from transactional execution"],
		["¤10","Restricted to forward branches in the constrained transactional-execution mode"],
		["¤11","For PFD and PFDRL, it is model dependent whether the instruction is restricted from transactional execution when the code in the M1 field is 6 or 7; for STCMH, it is model dependent whether the instruction is restricted when the M3 field is zero and the code in the R1 field is 6 or 7"],
		["¤12","Restricted from transactional execution when a guarded-storage event is recognized. When in the transactional-execution mode, the transaction is aborted, and the guarded-storage event is processed"],
		["¤2","Restricted from transactional execution when R2 nonzero and branch tracing is enabled"],
		["¤3","Restricted from transactional execution when mode tracing is enabled"],
		["¤4","Restricted from transactional execution when a monitor-event condition occurs"],
		["¤5","Model dependent whether the instruction is restricted from transactional execution"],
		["¤6","Restricted from transactional execution when the effective allow-AR-modification control is zero"],
		["¤7","Restricted from transactional execution when the effective allow-floating-point-operation control is zero"],
		["¤8","May be restricted from transactional execution depending on machine conditions"],
		["¤9","Restricted in the constrained transactionalexecution mode; a transaction-constraint program exception may be recognized. For STCMH, the instruction is restricted only when the M3 field is zero"]
	]);
	var formats = new Map([
		["E"    ,"h14"],
		["I"    ,"h12 bI"],
		["IE"   ,"h14 b(nl) nI1 nI2"],
		["MII"  ,"h12 nM1 tRI2 vRI3"],
		["RI-a" ,"h12 nR1 h3 hI2"],
		["RI-b" ,"h12 nR1 h3 hRI2"],
		["RI-c" ,"h12 nM1 h3 hRI2"],
		["RIE-a","h12 nR1 n(nl) hI2 nM3 n(nl) h34"],
		["RIE-b","h12 nR1 nR2 hRI4 nM3 n(nl) h34"],
		["RIE-c","h12 nR1 nM3 hRI4 bI2 h34"],
		["RIE-d","h12 nR1 nR3 hI2 b(nl) h34"],
		["RIE-e","h12 nR1 nR3 hRI2 b(nl) h34"],
		["RIE-f","h12 nR1 nR2 bI3 bI4 bI5 h34"],
		["RIE-g","h12 nR1 nM3 hI2 b(nl) h34"],
		["RIL-a","h12 nR1 h3 wI2"],
		["RIL-b","h12 nR1 h3 wRI2"],
		["RIL-c","h12 nM1 h3 wRI2"],
		["RIS"  ,"h12 nR1 nM3 nB4 tD4 bI2 h34"],
		["RR"   ,"h12 nR1 nR2*"],
		["RRD"  ,"h14 nR1 n(nl) nR3 nR2"],
		["RRE"  ,"h14 b(nl) nR1* nR2*"],
		["RRF-a","h14 nR3 nM4* nR1 nR2"],
		["RRF-b","h14 nR3 nM4* nR1 nR2"],
		["RRF-c","h14 nM3* nM4* nR1 nR2"],
		["RRF-d","h14 nM3* nM4* nR1 nR2"],
		["RRF-e","h14 nM3* nM4* nR1 nR2"],
		["RRS"  ,"h12 nR1 nR2 nB4 tD4 nM3 n(nl) h34"],
		["RS-a" ,"h12 nR1 nR3* nB2 tD2"],
		["RS-b" ,"h12 nR1 nM3 nB2 tD2"],
		["RSI"  ,"h12 nR1 nR3 hRI2"],
		["RSL-a","h12 nL1 n(nl) nB2 tD2 b(nl) h34"],
		["RSL-b","h12 bL1 nB2 tD2 b(nl) h34"],
		["RSY-a","h12 nR1 nR3 nB2 tDL2 bDH2 h34"],
		["RSY-b","h12 nR1 nM3 nB2 tDL2 bDH2 h34"],
		["RX-a" ,"h12 nR1 nX2 nB2 tD2"],
		["RX-b" ,"h12 nM1 nX2 nB2 tD2"],
		["RXE"  ,"h12 nR1 nX2 nB2 tD2 nM3* n(nl) h34"],
		["RXF"  ,"h12 nR3 nX2 nB2 tD2 nR1 n(nl) h34"],
		["RXY-a","h12 nR1 nX2 nB2 tDL2 bDH2 h34"],
		["RXY-b","h12 nM1 nX2 nB2 tDL2 bDH2 h34"],
		["S"    ,"h14 nB2* tD2*"],
		["SI"   ,"h12 bI2* nB1 tD1"],
		["SIL"  ,"h14 nB1 tD1 hI2"],
		["SIY"  ,"h12 bI2 nB1 tDL1 bDH1 h34"],
		["SMI"  ,"h12 nM1 n(nl) nB3 tD3 hRI2"],
		["SS-a" ,"h12 bL1 nB1 tD1 nB2 tD2"],
		["SS-b" ,"h12 nL1 nL2 nB1 tD1 nB2 tD2"],
		["SS-c" ,"h12 nL1 nI3 nB1 tD1 nB2 tD2"],
		["SS-d" ,"h12 nR1 nR3 nB1 tD1 nB2 tD2"],
		["SS-e" ,"h12 nR1 nR3 nB2 tD2 nB4 tD4"],
		["SS-f" ,"h12 bL2 nB1 tD1 nB2 tD2"],
		["SSE"  ,"h14 nB1 tD1 nB2 tD2"],
		["SSF"  ,"h12 nR3 h3 nB1 tD1 nB2 tD2"],
		["VRI-a","h12 nV1 n(nl) hI2 nM3* nRXB h34"],
		["VRI-b","h12 nV1 n(nl) bI2 bI3 nM4 nRXB h34"],
		["VRI-c","h12 nV1 nV2 hI2 nM4 nRXB h34"],
		["VRI-d","h12 nV1 nV2 nV3 n(nl) bI4 nM5* nRXB h34"],
		["VRI-e","h12 nV1 nV2 tI3 nM5 nM4 nRXB h34"],
		["VRI-f","h12 nV1 nV2 nV3 n(nl) nM5 bI4 nRXB h34"],
		["VRI-g","h12 nV1 nV2 bI4 nM5 bI3 nRXB h34"],
		["VRI-h","h12 nV1 n(nl) hI2 nI3 nRXB h34"],
		["VRI-i","h12 nV1 nR2 b(nl) nM4 bI3 nRXB h34"],
		["VRR-a","h12 nV1 nV2 b(nl) nM5* nM4* nM3* nRXB h34"],
		["VRR-b","h12 nV1 nV2 nV3 n(nl) nM5* n(nl) nM4* nRXB h34"],
		["VRR-c","h12 nV1 nV2 nV3 n(nl) nM6* nM5* nM4* nRXB h34"],
		["VRR-d","h12 nV1 nV2 nV3 nM5* nM6* n(nl) nV4 nRXB h34"],
		["VRR-e","h12 nV1 nV2 nV3 nM6* n(nl) nM5* nV4 nRXB h34"],
		["VRR-f","h12 nV1 nR2 nR3 h(nl) nRXB h34"],
		["VRR-g","h12 n(nl) nV1 v(nl) nRXB h34"],
		["VRR-h","h12 n(nl) nV1 nV2 n(nl) nM3 b(nl) nRXB h34"],
		["VRR-i","h12 nR1 nV2 b(nl) nM3 nM4* n(nl) nRXB h34"],
		["VRS-a","h12 nV1 nV3 nB2 tD2 nM4* nRXB h34"],
		["VRS-b","h12 nV1 nR3 nB2 tD2 nM4* nRXB h34"],
		["VRS-c","h12 nR1 nV3 nB2 tD2 nM4 nRXB h34"],
		["VRS-d","h12 n(nl) nR3 nB2 tD2 nV1 nRXB h34"],
		["VRV"  ,"h12 nV1 nV2 nB2 tD2 nM3* nRXB h34"],
		["VRX"  ,"h12 nV1 nX2 nB2 tD2 nM3* nRXB h34"],
		["VSI"  ,"h12 bI3 nB2 tD2 nV1 nRXB h34"]
	]);
	var cc = new Map([
		["z", "Zero"],
		["Z", "No zero"],
		["c", "Carry"],
		["C", "No carry"],
		["n", "Negative"],
		["N", "No Negative"],
		["p", "Positive"],
		["P", "No positive"],
		["o", "Overflow"],
		["O", "No overflow"]
	]);
	var arch = new Map([
		["1","DOS/VSE, S370 without vectors, DOS"],
		["2","S370"],
		["3","S370XA,ARCH-0,XA"],
		["4","S390, S390E, S370ESA, ARCH-1, ARCH-2, ARCH-3, ARCH-4, ESA"],
		["5","zSeries, ZS, z900, z800, ARCH-5, zSeries-1, ZOP, ZS-1"],
		["6","z990, z890, ARCH-6, zSeries-2, YOP, ZS-2"],
		["7","z9, ARCH-7, zSeries-3, ZS-3"],
		["8","z10, ARCH-8, zSeries-4, ZS-4"],
		["9","z11, z196, z114, ARCH-9, zSeries-5, ZS-5"],
		["10","z12, zEC12, zBC12, ARCH-10, zSeries-6, ZS-6"],
		["11","z13, ARCH-11, zSeries-7, ZS-7"],
		["12","z14, ARCH-12, zSeries-8, ZS-8"],
		["13","z15, ARCH-13, zSeries-9, ZS-9"]
	]);
//-----------------------------------------------------------------------------
// Format Names
//-----------------------------------------------------------------------------
	function formatName(x) {
		if (x.substring(0,1) == "$") return "<b>"+x.substring(1)+"</b>";
		x = x.replace( /([A-Z])([0-9])/g, '$1<sub>$2</sub>');
		x = x.replaceAll("HR","R&#x302;");
		x = x.replaceAll("LR","R&#x30c;");
		x = x.replaceAll("(s8)","<sup><span class=\"s8\">s8</span></sup>");
		x = x.replaceAll("(s16)","<sup><span class=\"s16\">s16</span></sup>");
		x = x.replaceAll("(u64)","<sup><span class=\"u64\">u64</span></sup>");
		x = x.replaceAll("(s64)","<sup><span class=\"s64\">s64</span></sup>");
		x = x.replaceAll("(u32)","<sup><span class=\"u32\">u32</span></sup>");
		x = x.replaceAll("(s32)","<sup><span class=\"s32\">s32</span></sup>");
		x = x.replaceAll("(nl)","<span class=\"null\">//</span>");
		return x;
	}
//-----------------------------------------------------------------------------
// Format flags
//-----------------------------------------------------------------------------
	function formatFlag(part) {
		var tb = "<td data-value=\""+part+"\">";
		var parts = part.split(" ");
		for (var j = 0; j < parts.length; j++) {
			tb += "<span title=\""+flags.get(parts[j])+"\">"+parts[j].replace( /([0-9])/g, '<sup>$1</sup>')+"</span>&nbsp;";
		}
		return tb+"</td>";
	}
//-----------------------------------------------------------------------------
// Format condition code
//-----------------------------------------------------------------------------
	function formatCC(part) {
		var tb = "<td>";
		for (var j = 0; j < part.length; j++) {
			p = part.charAt(j);
			c = p == p.toUpperCase() ? p.toLowerCase()+"&#x305;" : p;
			tb += "<span title=\""+cc.get(p)+"\">"+c+"</span>";
		}
		return tb+"</td>";
	}
//-----------------------------------------------------------------------------
// Format an Hex opcode box
//-----------------------------------------------------------------------------
	function makeBox(type,hex) {
		var h14 = "h$"+hex.substring(0,4);
		var h12 = "b$"+hex.substring(0,2);
		var h3  = "n$"+hex.substring(2,3);
		var h34 = "b$"+hex.substring(2,4); 
		box = formats.get(type) ?? "";
		box = box.replaceAll("h14",h14).replaceAll("h12",h12).replaceAll("h34",h34).replaceAll("h3",h3);
		var tb = "<td data-value=\""+hex.trim()+"\"><div><table class=\"tab1\">";
		var parts = box.split(" ");
		for (var j = 0; j < parts.length; j++) {
			p = parts[j];
			var c = p.substring(0,1);
			var pa = formatName(p.substring(1));
			switch(c) {
				case "n": tb += "<td class=\"nib\">"+pa+"</td>"; break;
				case "b": tb += "<td class=\"byte\">"+pa+"</td>"; break;
				case "t": tb += "<td class=\"trip\">"+pa+"</td>"; break;
				case "h": tb += "<td class=\"half\">"+pa+"</td>"; break;
				case "v": tb += "<td class=\"v24\">"+pa+"</td>"; break;
				case "w": tb += "<td class=\"word\">"+pa+"</td>"; break;
				default:
			}
		}
		return tb + "</table></td>";
	}
//-----------------------------------------------------------------------------
// Parse the csv data
//-----------------------------------------------------------------------------
	function parse(csvdata) {
		console.timeEnd('csv');
		console.time('parse');
		var sb = "";
		for (var k = 1;k < csvdata.length; k++) {
			var entry = csvdata[k];
			sb += "<tr>";
			for (var i = 0; i < 14; i++) {
				var data = entry[i];
				switch(i) {
					case 0: // Instruction
						data = "<td data-value=\""+data+"\">"+data+"</td>";
						break;
					case 1: // Mnemonic
					case 3: // Format
						data = "<td data-value=\""+data+"\">"+data.replaceAll("-","&#x2011;");+"</td>";
						break;
					case 2:	// Operand
					case 5: // Operation
						data = "<td>"+formatName(data)+"</td>";
						break;
					case 4: // HexOp
						data = makeBox(entry[i-1],data);
						break;
					case 6: // CC0
					case 7: // CC1
					case 8: // CC2
					case 9: // CC3
						data = formatCC(data);
						break;
					case 10: // Flags
						data = formatFlag(data);
						break;
					case 11: // Facility
						data = "<td><span title=\""+flags.get(data)+"\">"+data+"</span></td>";
						break;
					case 12: // Family
						data = "<td>"+data+"</td>";
						break;
					case 13: // Arch
						data = "<td><span title=\""+arch.get(data)+"\">"+data+"</span></td>";
						break;
					default:
						data = "<td>"+data+"</td>";
				}
				sb += data;
			}
			sb += "</tr>";
			cacheData.push(entry);
		}
		optab.find('tbody').append(sb);
		console.timeEnd('parse');
		console.time('filter');
		$('#count').text(cacheData.length);
		optab.excelTableFilter(cacheData,{
			columnSelector: '.filter',
			sort: true,
			search: true
		});
		console.timeEnd('filter');
		$('#splash').hide();

		setTimeout(() => {
			console.time('tooltips');
			$('[title][title!=""]').tooltip({
				content: function () {
					return $(this).prop('title');
				}
			});
			console.timeEnd('tooltips');
			console.time('finish');
			optab.width(optab.width());
			console.timeEnd('finish');

			console.time('finish2');
			optab.find("th" ).each(function( index ) {
				$(this).width($(this).width());
			});
			console.timeEnd('finish2');
		}, 0);
	}
//-----------------------------------------------------------------------------
// Start of code: read the table, parse & format
//-----------------------------------------------------------------------------
	$.ajax({
		type: "GET",  
		url: "opcodes.csv",
		dataType: "text",
		beforeSend: function(jqXHR) {
			jqXHR.overrideMimeType('text/html;charset=iso-8859-1');
		},
		success: function(response) {
			console.timeEnd('load');
			console.time('csv');
			parse($.csv.toArrays(response));
		}
	});

});
