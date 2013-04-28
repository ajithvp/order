<?php
class Connection extends CI_Model
{
	 function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }
    
    function getuser($username,$password)
    {
        //$query = $this->db->get('usermaster', 1);
		$query = $this->db->query("SELECT count(*) AS cnt FROM usermaster WHERE umUserName = ".$this->db->escape($username)." AND umPassword =".$this->db->escape($password)." AND umIsActive = 1");
        return $query;
    }
	function getuserdet($username,$password)
	{
		$query = $this->db->get_where('usermaster', array('umUserName' => $username, 'umPassword' => $password));
		return $query;
	}
	function getSecurityUserAccess($userId)
	{
		$query = $this->db->query("SELECT suaSecurityLevelMaster AS 'level',suaFormName,suaUserId FROM securityuseraccess 
					INNER JOIN securitylevelmaster ON slmId = suaSecurityLevelMaster
					INNER JOIN usermaster ON umId = suaUserId
					WHERE suaUserId = ".$userId."");//AND suaSecurityLevelMaster = 2
		return $query;
	}
	// function selectUsersList()
	// {
		// $query = $this->db->get('userMaster');
		// return $query;
	// }
	function addUser($data)
	{
		$this->db->insert('userMaster', $data);
		return true;
	}
	function addDivision($data)
	{
		$this->db->insert('divisionmaster', $data);
		return true;
	}
	function addArea($data)
	{
		$this->db->insert('areamaster', $data);
		return true;
	}
	function addZone($data)
	{
		$this->db->insert('zonemaster', $data);
		return true;
	}
	function addBranch($data)
	{
		$this->db->insert('branchmaster', $data);
		return true;
	}
	function addCustomer($data)
	{
		$this->db->insert('storemaster', $data);
		return true;
	}
	function addproductDet($data)
	{
		$this->db->insert('productList', $data);
		return true;
	}
	function getproductCode($ProductCode)
	{
		$query = $this->db->query("select *  from productlist where pmProductCode='".$ProductCode."'");
		return $query;
	}
	function getCount($table,$field,$str)
	{
		$query = $this->db->query("select Count(*) AS cnt  from ".$table." where ".$field." ='".$str."'");
		return $query;
	}
	function addproductDets($data)
	{
		//$this->db->query('INSERT INTO productlist(pmProductCode,pmProductName,pmCategory,pmMRP,pmDivisionCode,pmDescription,pmTS) VALUES ("'.$data.'"');
		for($i=0;$i<count($data['pmProductCode']);$i++){
			$this->db->query("INSERT INTO productlist(pmProductCode,pmProductName,pmCategory,pmMRP,pmDivisionCode,pmDescription,pmTS)
			VALUES ('".$data['pmProductCode'][$i]."', '".$data['pmProductName'][$i]."','".$data['pmCategory'][$i]."','".$data['pmMRP'][$i]."','".$data['pmDivisionCode'][$i]."','".$data['pmDescription'][$i]."',CURRENT_TIMESTAMP) ");
		}
		
		return true;
	}
	function addSubAreaForRep($data)
	{
		$this->db->insert('SubAreaForRepMaster', $data);
		return true;
	}
	function getUsername($data)
	{
		$query = $this->db->query('SELECT count(*) AS cnt FROM usermaster WHERE umUserName = "'.$data.'"');
        return $query;
	}
	function getStorname($data)
	{
		$query = $this->db->query('SELECT count(*) AS cnt FROM storemaster WHERE smStoreName = "'.$data.'"');
        return $query;
	}
	function getStoreCode($data)
	{
		$query = $this->db->query('SELECT count(*) AS cnt FROM storemaster WHERE smStoreCode = "'.$data.'"');
        return $query;
	}
	
	 function getUserCode()
	 {
		$query = $this->db->query('SELECT IFNULL(MAX(RIGHT(umUserCode,1)), "1") AS UserCodeNew FROM usermaster  WHERE umUserCode LIKE "USR%"');
        return $query;
	 }	
	function getStoreData($subAreaId = '')
    {
		if($subAreaId == '')
		{
			$query=$this->db->query('SELECT smStoreCode, smId, smStoreName FROM storemaster ORDER BY smStoreName ASC');
		}
		else
		{
			$query=$this->db->query('SELECT smStoreCode, smId, smStoreName FROM storemaster WHERE smIsActive = '. 1 .'  AND smId NOT IN(
				SELECT DISTINCT stsStoreId FROM storetosubareaforrep WHERE stsSubAreaForRepId = '.$subAreaId.') ORDER BY smStoreName ASC');
		}
        return $query;
    }
	
	function getManagerData($subAreaId)
    {
        //$query=$this->db->query("SELECT umUserCode, umId, CONCAT(umFirstName,' ',umLastName) AS umUserName FROM usermaster WHERE umIsManager = '" . 1 . "'");
		$query=$this->db->query("SELECT umUserCode, umId, CONCAT(umFirstName,' ',umLastName) AS umUserName FROM usermaster WHERE umIsManager = ". 1 ." AND umIsActive = ". 1 ." AND umId NOT IN(
			SELECT DISTINCT mtsManagerId FROM managertosubareaforrep WHERE mtsSubAreaForRepId = ".$subAreaId.")");
        return $query;
    }
	
	function getSRData($subAreaId)
    {
        $query=$this->db->query("SELECT umUserCode, umId, CONCAT(umFirstName,' ',umLastName) AS umUserName FROM usermaster WHERE umIsSalesRep = ". 1 ." AND umIsActive = ". 1 ." AND umId NOT IN(
			SELECT DISTINCT srsSalesRepId FROM salesreptosubareaforrep WHERE srsSubAreaForRepId = ".$subAreaId.")");
        return $query;
    }
	
	function searchBranchData($type, $searchString) {
		if($type == "branch") {
			$type = "bmBranchName";
		}
		else {
			$type = "bmBranchCode";
		}
		$query = $this->db->query("SELECT bmBranchCode, bmBranchID, bmBranchName FROM branchmaster WHERE ".$type." LIKE '%".$searchString."%'");
		return $query;
	}
	function searchStoreData($type, $searchString, $subAreaId) {
		if($type == "store") {
			$type = "smStoreName";
		}
		else {
			$type = "smStoreCode";
		}
		$query = $this->db->query("SELECT smStoreCode, smId, smStoreName FROM storemaster WHERE ".$type." LIKE '%".$searchString."%' AND smId NOT IN(
			SELECT DISTINCT stsStoreId FROM storetosubareaforrep WHERE stsSubAreaForRepId = ".$subAreaId.") ORDER BY smStoreName");
		return $query;
	}
	function searchManagerData($type, $searchString, $subAreaId) 
	{
		if($type == "manager") {
			$type = "CONCAT(umFirstName,' ',umLastName)";
		}
		else {
			$type = "umUserCode";
		}
		$query = $this->db->query("SELECT CONCAT(umFirstName,' ',umLastName) AS umUserName,umId,umUserCode FROM usermaster WHERE ".$type." LIKE '%".$searchString ."%' AND umIsManager = " . 1 . " AND umId NOT IN(
			SELECT DISTINCT mtsManagerId FROM managertosubareaforrep WHERE mtsSubAreaForRepId = ".$subAreaId.")");
		return $query;
	}
	function searchSRData($type, $searchString, $subAreaId) 
	{
		if($type == "SR") {
			$type = "CONCAT(umFirstName,' ',umLastName)";
		}
		else {
			$type = "umUserCode";
		}
		$query = $this->db->query("SELECT CONCAT(umFirstName,' ',umLastName) AS umUserName,umId,umUserCode FROM usermaster WHERE ".$type." LIKE '%".$searchString ."%' AND umIsSalesRep = " . 1 . " AND umId NOT IN(
			SELECT DISTINCT srsSalesRepId FROM salesreptosubareaforrep WHERE srsSubAreaForRepId = ".$subAreaId.")");
		return $query;
	}
	
	function getBranchName()
	{
		$query=$this->db->query('SELECT bmBranchID,bmBranchCode,bmBranchName FROM branchmaster');
		return $query;
	}
	function getZoneName()
	{
		$query=$this->db->query('SELECT zmId,zmZoneName FROM zonemaster');
		return $query;
	}
	function getAreaName($userId)
	{
		$query=$this->db->query('SELECT getuserauthorizedmodeitems('.$userId.')');
		$query=$this->db->query('Select Id AS amId,Name AS amAreaName from userauthorizedmodeitems Where Mode="Area" Order By Name ');
		//$query=$this->db->query('SELECT amId,amAreaName FROM areamaster');
		return $query;
	}
	function getDivisionName($userId)
	{
		$query=$this->db->query('SELECT getuserauthorizedmodeitems('.$userId.')');
		$query=$this->db->query('Select Id AS dmId, Code AS dmCode, Name AS dmDivisionName from userauthorizedmodeitems Where Mode="Division" Order By Name ');
		//$query=$this->db->query('SELECT dmId,dmDivisionName,dmCode FROM divisionmaster ORDER BY dmId DESC');
		return $query;
	}
	
	function get_dropdown_array_subArea($key, $value, $from){
        $result = array();
        $array_keys_values = $this->db->query('select '.$key.', '.$value.' from '.$from.' order by '.$key.' asc');
		$result[-1]= "Select One";
		foreach ($array_keys_values->result() as $row)
        {
            $result[$row->$key]= $row->$value;
        }
        return $result;
    } 
	
	function get_dropdown_array_category($key, $value, $from, $divId){
	//die($key.' '.$value.' '.$from.' '.$divId);
	//pmProductId pmCategory productlist 5
        $result = array();
		if($divId != 'all')
		{
			if($divId != -2)
			{
				$array_keys_values = $this->db->query('select distinct '.$value.' from '.$from.' where  pmDivisionCode = '.$divId.' order by '.$value.' asc');
				//Select distinct pmCategory from productlist where pmDivisionCode = 5
			}
			else
			{
				$array_keys_values = $this->db->query('select distinct '.$value.' from '.$from.' order by '.$value.' asc');
			}
		}
		else
		{
			$array_keys_values = $this->db->query('select distinct '.$value.' from '.$from.' order by '.$value.' asc');
		}
		$result[-1] = "Select One";
		foreach ($array_keys_values->result() as $row)
        {
            $result[$row->$value]= $row->$value;
        }
        return $result;
		//var_dump($result);
    } 
	function get_dropdown_array_salesrep(){
		$value = 'umFirstName';
		$Id = 'umId';
        $result = array();
		$array_keys_values = $this->db->query('select distinct  
			  '.$value.' , '.$Id.'
			FROM (salesreptosubareaforrep s
			   INNER JOIN usermaster um
				 ON ((s.srsSalesRepId = um.umId)))
			WHERE um.umIsSalesRep = 1 AND um.umIsActive = 1 Order By um.umFirstName');
		
		$result[-1] = "Select One";
		foreach ($array_keys_values->result() as $row)
        {
            $result[$row->$Id]= $row->$value;
        }
        return $result;
    } 
	
	function getSalesRep()
	{
		$query=$this->db->query("SELECT umid,CONCAT(umFirstName,' ',umLastName) AS FLname FROM usermaster WHERE umIsSalesRep = 1");
		return $query;
	}
	function getAreaManager()
	{
		$query=$this->db->query("SELECT umid,CONCAT(umFirstName,' ',umLastName) AS FLname FROM usermaster WHERE umIsManager = 1");
		return $query;
	}
	function getStore()
	{
		$query=$this->db->query('SELECT smId,smStoreName FROM storemaster');
		return $query;
	}
	function deleteUser($id)
	{
		$this->db->query('DELETE FROM usermaster WHERE umId = '.$id.'');
		return true;
	}
	function getsubAreaName()
	{
		$query = $this->db->query('SELECT saId,saSubAreaName FROM subareaforrepmaster');
		return $query;
	}
	function searchsubAreaData($value)
	{
		$query = $this->db->query("SELECT saId,saSubAreaName FROM subareaforrepmaster WHERE saSubAreaName LIKE '%".$value."%'");
		return $query;
	}
	function searchzoneData($value)
	{
		$query = $this->db->query("SELECT zmId,zmZoneName FROM zonemaster WHERE zmZoneName LIKE '%".$value."%'");
		return $query;
	}
	function searchareaData($value)
	{
		$query = $this->db->query("SELECT amId,amAreaName FROM areamaster WHERE amAreaName LIKE '%".$value."%'");
		return $query;
	}
	function searchdivisionData($value)
	{
		$query = $this->db->query("SELECT dmCode,dmId,dmDivisionName FROM divisionmaster WHERE dmDivisionName LIKE '%".$value."%'");
		return $query;
	}
	function addSalesRepToSubArea($data)
	{
		$this->db->where('srsSalesRepId !=', $data['srsSalesRepId']);
		$this->db->where('srsSubAreaForRepId !=', $data['srsSubAreaForRepId']);
		$query = $this->db->insert('salesreptosubareaforrep',$data);
		return true;
	}
	function addManagerToSubArea($data)
	{
		$this->db->where('mtsManagerId !=', $data['mtsManagerId']);
		$this->db->where('mtsSubAreaForRepId !=', $data['mtsSubAreaForRepId']);
		$query = $this->db->insert('managertosubareaforrep',$data);
		return true;
	}
	function addStoreToSubArea($data)
	{
		$this->db->where('stsStoreId !=', $data['stsStoreId']);
		$this->db->where('stsSubAreaForRepId !=', $data['stsSubAreaForRepId']);
		$query = $this->db->insert('storetosubareaforrep',$data);
		return true;
	}
	function getSubAreaAlloctionSalesRep($id)
	{
		//$query = $this->db->query("call spGetSubAreaAllocateSalesRep(".$id.");");
		//$query = $this->db->query("Select DISTINCT Id,LinkId,Code,FirstName,LastName,SubAreaId,GUID,TimeStamp,UserType From view_subareaallocation Where SubAreaId ='". $id."' order by UserType,FirstName");
		$query = $this->db->query("SELECT DISTINCT
			  um.umUserCode,
			  s.srsId,
			  s.srsSalesRepId,
			  um.umFirstName,
			  um.umLastName,
			  s.srsSubAreaForRepId,
			  s.srsGuid,
			  s.srsTS,
			  0
			FROM (salesreptosubareaforrep s
			   INNER JOIN usermaster um
				 ON ((s.srsSalesRepId = um.umId)))
			WHERE (um.umIsSalesRep = 1) AND srsSubAreaForRepId = ".$id." Order By um.umFirstName");
		return $query;
	}
	function getSubAreaAlloctionManager($id)
	{
		//$query = $this->db->simple_query("call spGetSubAreaAllocateManager(".$id.");");
		$query = $this->db->query("SELECT
	   s.mtsId               AS Id,
	   s.mtsManagerId        AS LinkId,
	   um.umUserCode         AS Code,
	   um.umFirstName        AS FirstName,
	   um.umLastName         AS LastName,
	   s.mtsSubAreaForRepId  AS SubAreaId,
	   s.mtsGuid             AS GUID,
	   s.mtsTS               AS TimeStamp,
	   1                         AS UserType
	 FROM (managertosubareaforrep s
	    JOIN usermaster um
	      ON ((s.mtsManagerId = um.umId)))
	 WHERE (um.umIsManager = 1) AND mtsSubAreaForRepId = ".$id." Order By FirstName");
		return $query;
	}
	function getSubAreaAlloctionCustomer($id)
	{
		//$query = $this->db->simple_query("call spGetSubAreaAllocateCustomer(".$id.");");
		$query = $this->db->query("SELECT s.stsId AS 'Id',
	   s.stsStoreId           AS LinkId,
	   um.smStoreCode         AS Code,
	   um.smStoreName         AS FirstName,
	   ''                         AS LastName,
	   s.stsSubAreaForRepId   AS SubAreaId,
	   s.stsGuid              AS GUID,
	   s.stsTS                AS TimeStamp,
	   2                          AS UserType
	 FROM (storetosubareaforrep s
	    JOIN storemaster um
	      ON ((s.stsStoreId = um.smId)))
	WHERE stsSubAreaForRepId = ".$id."  Order By FirstName");
		return $query;
	}
	// function deleteSubAreaSalesRep_model($id)
	// {
		// $query = $this->db->query("DELETE FROM salesreptosubareaforrep WHERE srsId =".$id."");
		// return true;
	// }
	function deleteSubAreaAllocation_model($id,$type)
	{
		if($type == 'salesRep')
		{
			$query = $this->db->query("DELETE FROM salesreptosubareaforrep WHERE srsId =".$id."");
			return true;
		}
		else if($type == 'manager')
		{
			$query = $this->db->query("DELETE FROM managertosubareaforrep WHERE mtsId =".$id."");
			return true;
		}
		else
		{
			$query = $this->db->query("DELETE FROM storetosubareaforrep WHERE stsId =".$id."");
			return true;
		}
	}
	function addAreaMatrix($data)
	{
		$query = $this->db->insert('areaMatrix', $data);
		return true;
	}
	function getAreaMatrix($subAreaId)
	{
		$query = $this->db->query("SELECT amxId, z.zmZoneName, a.amAreaName, d.dmDivisionName FROM areamatrix am
					INNER JOIN zonemaster z ON z.zmId = am.amxZoneId
					INNER JOIN areamaster a ON a.amId = am.amxAreaId
					INNER JOIN divisionmaster d ON d.dmId = am.amxDivisionId
					WHERE amxSubAreaForRepId = ".$subAreaId."");
		return $query;
	}
	function removeAreaMatrixById_model($amxId)
	{
		$query = $this->db->query("DELETE FROM areaMatrix WHERE amxId=".$amxId."");
		return true;
	}
	
	function getProductsAutocomplete($category, $term) {
		$query = $this->db->query("SELECT pmProductId,pmProductCode,pmProductName,pmMRP FROM productlist WHERE pmCategory='".$category."' AND pmProductName LIKE '".$term."%'");
		return $query->result_array();
	}
	function getAreasAutocomplete($userId,$value, $term,$isHo) {
		$union = '';
		if($isHo == 'true'){
			$union = 'Select Distinct -2 AS amId, "ALL" AS amAreaName from userauthorizedmodeitems UNION All ';
		}
		$query=$this->db->query('SELECT getuserauthorizedmodeitems('.$userId.')');
		$query=$this->db->query(''.$union.' Select Id AS amId,Name AS amAreaName from userauthorizedmodeitems Where Mode="Area" AND Name LIKE "'.$term.'%" Order By amAreaName ');
		return $query->result_array();
	}
	function getDivisionAutocomplete($userId,$value, $term,$isHo) {
		$union = '';
		if($isHo == 'true'){
			$union = 'Select Distinct -2 AS dmId,-2 AS dmCode, "ALL" AS dmDivisionName from userauthorizedmodeitems UNION All ';
		}
		$query=$this->db->query('SELECT getuserauthorizedmodeitems('.$userId.')');
		$query=$this->db->query(''.$union.' Select Id AS dmId, Code AS dmCode, Name AS dmDivisionName from userauthorizedmodeitems Where Mode="Division" AND Name LIKE "'.$term.'%" Order By dmDivisionName ');
		return $query->result_array();
	}
	function getCustomerAutocomplete($userId,$areaId,$divId,$term) {
		if($areaId == '' && $divId == ''){
			$areaId = 0 ;
			$divId = 0 ;
		}
		else if($areaId != '' && $areaId != -2 && ($divId == '' || $divId == -2))
		{
			//$query = $this->db->query('Select Distinct -2 AS smId,-2 AS smStorecode, "ALL" AS smStoreName from userauthorizedmodeitems ');
			$query = $this->db->query('SELECT getuserauthorizedmodeitems('.$userId.')');
			$query = $this->db->query("Select Distinct Id AS smId,Code AS smStorecode,Name AS smStoreName from userauthorizedmodeitems
					   inner join divisionmaster on divisionid=dmid Where Mode='Store' And AreaId= ".$areaId."
					   AND Name LIKE '".$term."%' Order By Name");
		}
		else if($areaId == -2 || $divId == -2){
			$query = $this->db->query('Select Distinct -2 AS smId,-2 AS smStorecode, "ALL" AS smStoreName from userauthorizedmodeitems ');
		}
		else
		{
			//$query = 'Select Distinct -2 AS smId,-2 AS smStorecode, "All Store" AS smStoreName from userauthorizedmodeitems ';
			$query = $this->db->query('SELECT getuserauthorizedmodeitems('.$userId.')');
			$query = $this->db->query("Select Distinct Id AS smId,Code AS smStorecode,Name AS smStoreName from userauthorizedmodeitems
					   inner join divisionmaster on divisionid=dmid Where Mode='Store' And AreaId= ".$areaId."
					  And dmId=".$divId." AND Name LIKE '".$term."%' Order By Name");
	   }
	   return $query->result_array();
	}
	
	function getProductslist($categoryName)
	{
		$query = $this->db->query("SELECT pmProductId,pmProductCode,pmProductName,pmMRP FROM productlist WHERE pmCategory='".$categoryName."'");
		return $query;
	}
	function searchProductData($categoryName, $type, $searchstring)
	{
		if($type == 'product')
		{
			$type = 'pmProductName';
		}
		else
		{
			$type = 'pmProductCode';
		}
		$query = $this->db->query("SELECT pmProductId, pmProductCode, pmProductName,pmMRP FROM productlist WHERE pmCategory='".$categoryName."' AND ".$type." LIKE '%".$searchstring."%'");
		return $query;
	}
	function getStoreDataByArea($userId,$areaId,$divId = '')
	{
		$condition = '';
		if($divId != ''){
			$condition = "And dmId=".$divId."";
		}
		$query=$this->db->query('SELECT GetUserAuthorizedModeItems('.$userId.')');
		$query = $this->db->query("Select Distinct Id AS smId,Code AS smStorecode,Name AS smStoreName from userauthorizedmodeitems
				   inner join divisionmaster on divisionid=dmid Where Mode='Store' And AreaId= ".$areaId." 
				   ".$condition." Order By Name");
		return $query;
	}
	
	function searchStoreDataByArea($type, $searchString, $areaId) {
		if($type == "store") {
			$type = "smStoreName";
		}
		else {
			$type = "smStorecode";
		}
		$query = $this->db->query("SELECT DISTINCT smId, smStoreName, smStorecode
			FROM storemaster 
			INNER JOIN storetosubareaforrep ON stsStoreId=smId 
			INNER JOIN areamatrix am ON stsSubAreaForRepId=amxSubAreaForRepId
			INNER JOIN areamaster a ON a.amId = am.amxAreaId 
			WHERE ".$type." LIKE '%".$searchString."%' AND a.amId = ".$areaId."");
		return $query;
	}
	function deleteallProducts()
	{
		$query = $this->db->query("TRUNCATE TABLE ProductList");
	}
	
	function getLevelMasterlist()
	{
		$q = <<<EOF
			SELECT slmLevelName,
			(CASE WHEN slmView=1 THEN 'TRUE' ELSE 'FALSE' END) AS slmView,
			(CASE WHEN slmInsert=1 THEN 'TRUE' ELSE 'FALSE' END) AS slmInsert,
			(CASE WHEN slmUpdate=1 THEN 'TRUE' ELSE 'FALSE' END) AS slmUpdate,
			(CASE WHEN slmDelete=1 THEN 'TRUE' ELSE 'FALSE' END) AS slmDelete FROM securitylevelmaster 
EOF;
		$query = $this->db->query($q);
		return $query;
	}
	function getUserDetails($userType)
	{
		$query = $this->db->query("SELECT umId,umUserCode,umUserName AS userName FROM usermaster WHERE ".$userType." = 1 ORDER BY umFirstName");
		return $query;
	}
	function searchUserDetails($userType,$type,$searchString)
	{
		if($type == 'Name')
		{
			$type = 'umUserName';
		}
		else
		{
			$type = 'umUserCode';
		}
		$query = $this->db->query("SELECT umId,umUserCode,umUserName AS userName FROM usermaster WHERE ".$userType." = 1 AND ".$type." LIKE '%".$searchString."%' ORDER BY umFirstName");
		return $query;
	}
	function insertUserAccessDet($userId,$formName,$level)
	{
		$this->db->query("call spinsertorupdatesecurityaccess(".$userId.",'".$formName."',".$level.");");
		//$query = $this->db->query("INSERTs INTO securityuseraccess(suaUserId,suaFormName,suaSecurityLevelMaster,suaGuid,suaTS) VALUES(".$userId.",'".$formName."',".$level.",'',CURRENT_TIMESTAMP)");
		Return true;
	}
	function getUserss()
	{
		$query = $this->db->query("Select umUserName FROM usermaster");
		//$query = $this->db->query("INSERTs INTO securityuseraccess(suaUserId,suaFormName,suaSecurityLevelMaster,suaGuid,suaTS) VALUES(".$userId.",'".$formName."',".$level.",'',CURRENT_TIMESTAMP)");
		return $query;
	}
} 
?>