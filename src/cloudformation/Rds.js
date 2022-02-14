// eslint-disable-next-line no-unused-vars
export class Rds{

    static vpc = {
        quickVPC: {
            Type: "AWS::EC2::VPC",
            Properties: {
                CidrBlock: "10.0.0.0/16",
                EnableDnsSupport: true,
                Tags: [
                    {
                        Key: "Name",
                        Value: "quickVPC"
                    }
                ]
            }
        }
    }

    static publicSubnet01 = {
        publicSubnet01: {
            Type: "AWS::EC2::Subnet",
            Properties: {
                AvailabilityZone: "ap-northeast-1a",
                VpcId:{
                    "Ref": "quickVPC"
                },
                CidrBlock: "10.0.0.0/24",
                Tags: [
                    {
                        Key: "Name",
                        Value: "publicsubnet01"
                    }
                ]
            }
        }
    }

    static publicSubnet02 = {
        publicSubnet02: {
            Type: "AWS::EC2::Subnet",
            Properties: {
                AvailabilityZone: "ap-northeast-1c",
                VpcId:{
                    "Ref": "quickVPC"
                },
                CidrBlock: "10.0.2.0/24",
                Tags: [
                    {
                        Key: "Name",
                        Value: "publicsubnet02"
                    }
                ]
            }
        }
    }

    static privateSubnet01 = {
        privateSubnet01: {
            Type: "AWS::EC2::Subnet",
            Properties: {
                AvailabilityZone: "ap-northeast-1a",
                VpcId:{
                    "Ref": "quickVPC"
                },
                CidrBlock: "10.0.1.0/24",
                Tags: [
                    {
                        Key: "Name",
                        Value: "privateSubnet01"
                    }
                ]
            }
        }
    }

    static privateSubnet02 = {
        privateSubnet02: {
            Type: "AWS::EC2::Subnet",
            Properties: {
                AvailabilityZone: "ap-northeast-1c",
                VpcId:{
                    "Ref": "quickVPC"
                },
                CidrBlock: "10.0.3.0/24",
                Tags: [
                    {
                        Key: "Name",
                        Value: "privateSubnet02"
                    }
                ]
            }
        }
    }

    static internetGateway = {
        igw: {
            Type: "AWS::EC2::InternetGateway",
            Properties: {
                Tags: [
                    {
                        Key: "Name",
                        Value: "igw"
                    }
                ]
            }
        }
    }

    static attachGateway = {
        AttachGateway: {
            Type: "AWS::EC2::VPCGatewayAttachment",
            Properties:{
                VpcId: {
                    "Ref": "quickVPC"
                },
                InternetGatewayId: {
                    "Ref": "igw"
                }
            }
        }
    }

    static routepublicsubnet = {
        Routepublicsubnet: {
            Type: "AWS::EC2::RouteTable",
            Properties: {
                VpcId: {
                    "Ref": "quickVPC"
                },
                Tags: [
                    {
                        Key: "Name",
                        Value: "rt-publicsubnet"
                    }
                ]
            }

        }
    }

    static routePublic = {
        routePublic: {
            Type: "AWS::EC2::Route",
            Properties: {
                RouteTableId: {
                    "Ref": "Routepublicsubnet"
                },
                DestinationCidrBlock: "0.0.0.0/0",
                GatewayId: {
                    "Ref": "igw"
                }
            }
        }
    }

    static routeTableAssocPublic01 = {
        routeTableAssocPublic01:{
            Type: "AWS::EC2::SubnetRouteTableAssociation",
            Properties: {
                SubnetId: {
                    "Ref": "publicSubnet01"
                },
                RouteTableId: {
                    "Ref": "Routepublicsubnet"
                }
            }
        }
    }

    static routeTableAssocPublic02 = {
        routeTableAssocPublic02: {
            Type: "AWS::EC2::SubnetRouteTableAssociation",
            Properties: {
                SubnetId: {
                    "Ref": "publicSubnet02"
                },
                RouteTableId: {
                    "Ref": "Routepublicsubnet"
                }
            }
        }

    }

    static secGroupPublic = {
        SecGroupPublic: {
            Type: "AWS::EC2::SecurityGroup",
            Properties: {
                GroupName: "GroupName-SG",
                GroupDescription: "SecGroupPublic",
                VpcId: {
                    "Ref": "quickVPC"
                },
                SecurityGroupIngress: [
                    {
                        IpProtocol: "tcp",
                        FromPort: 80,
                        ToPort: 80,
                        CidrIp: "0.0.0.0/0"
                    },
                    {
                        IpProtocol: "tcp",
                        FromPort: 22,
                        ToPort: 22,
                        CidrIp: "0.0.0.0/0"
                    }
                ]
            }
        }
    }

    static publicEC2Instance = {
        publicEC2Instance: {
            Type: "AWS::EC2::Instance",
            Properties: {
                KeyName: "KeyPair-2200212",
                DisableApiTermination: false,
                ImageId: "ami-09ebacdc178ae23b7",
                InstanceType: "t2.micro",
                Monitoring: false,
                NetworkInterfaces: [
                    {
                        AssociatePublicIpAddress: "true",
                        DeviceIndex: "0",
                        SubnetId: {
                            "Ref": "publicSubnet01"
                        },
                        GroupSet: [
                            {
                                "Ref": "SecGroupPublic"
                            }
                        ]
                    }
                ],
                Tags: [
                    {
                        Key: "Name",
                        Value: "publicEC2Instance"
                    }
                ]
            }
        }
    }







    static rdsYamlFormat = {
        Resources: {
            DBInstance: {
                Type: 'AWS::RDS::DBInstance',
                DeletionPolicy: 'Snapshot',
                Properties: {
                    AllocatedStorage: '5',
                    DBInstanceClass: 'db.t4g.micro',
                    DBParameterGroupName: {
                        Ref: "DBParameterGroup"
                    },
                    DBSubnetGroupName: {
                        Ref: 'DBSubnetGroup'
                    },
                    Engine: 'MySQL',
                    EngineVersion: '5.6.46',
                    MasterUsername: 'qiuckdeploy',
                    MasterUserPassword: 'qiuckdeploy',
                    StorageType: 'gp2'
                }
            },
            DBSubnetGroup: {
                Type: "AWS::RDS::DBSubnetGroup",
                Properties: {
                    DBSubnetGroupDescription: "custom subnet group",
                    SubnetIds: [
                        "subnet-aaaaaaaa",
                        "subnet-bbbbbbbb",
                        "subnet-cccccccc"
                    ]
                }
            },
            DBParameterGroup: {
                Type: "AWS::RDS::DBParameterGroup",
                Properties: {
                    Description: "custom paramter group",
                    Family: "MySQL5.6",
                    Parameters: {
                        character_set_database: "utf8mb4",
                        character_set_client: "utf8mb4",
                        character_set_connection: "utf8mb4",
                        character_set_results: "utf8mb4",
                        character_set_server: "utf8mb4"
                    }
                }
            },
            VPC1: {
                Type: "AWS::EC2::VPC",
                Properties: {
                    CidrBlock: "192.168.0.0/16"
                },
            },
            Subnet1: {
                Type: "AWS::EC2::Subnet",
                Properties: {
                    VpcId: {
                        Ref: "VPC1"
                    },
                    CidrBlock: "192.168.1.0/24"
                },
            },
            RouteTable1: {
                Type: "AWS::EC2::RouteTable",
                Properties: {
                    VpcId: {
                        Ref:"VPC1"
                    }
                },
            },
            RouteTable12Subnet1: {
                Type: "AWS::EC2::SubnetRouteTableAssociation",
                Properties: {
                    RouteTableId: {
                        Ref: "RouteTable1"
                    },
                    SubnetId: {
                        Ref: "Subnet1"
                    }
                },
            },
            Route1: {
                Type: "AWS::EC2::Route",
                Properties: {
                    DestinationCidrBlock: "0.0.0.0/0",
                    GatewayId: {
                        Ref: "IGW1"
                    },
                    RouteTableId: {
                        "Ref": "RouteTable1"
                    }
                },
            },
        }
    }

    static get getRdsYamlFormat(){
        return this.rdsYamlFormat
    }

    static get geTestYamlFormat(){
        let object = {
            Resources: {
                ...this.vpc,
                ...this.publicSubnet01,
                ...this.publicSubnet02,
                ...this.privateSubnet01,
                ...this.privateSubnet02,
                ...this.internetGateway,
                ...this.attachGateway,
                ...this.routepublicsubnet,
                ...this.routePublic,
                ...this.routeTableAssocPublic01,
                ...this.routeTableAssocPublic02,
                ...this.secGroupPublic,
                ...this.publicEC2Instance
            }
        }

        return object

    }
}