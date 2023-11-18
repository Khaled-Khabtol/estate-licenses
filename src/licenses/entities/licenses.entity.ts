import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class License {

    @PrimaryGeneratedColumn()
    id: number;

    //@Column('json', { nullable: true })
    @Column('json')
    main_data: {
        license_number_secretariat: string;
        license_number: string;
        request_number: string;
        license_start_date: string;
        license_end_date: string;
        license_type: string;
        building_type: string;
        buildings_number: string;
        license_separated_another_license: string;
        main_use: string;
        sub_use: string;
        total_land_area: string;
        building_description: string;
    };

    @Column('json')
    applicant_data: {
        applicant_characteristics: string;
        applicant_id: string;
        applicant_name: string;
        phone: string;
        email: string;
    };

    @Column('json')
    ownershipData: {
        ownership_type: string;
        ownership_number: string;
        ownership_date: string;
        scheme_number: string;
        plot_number: string;
    };

    @Column('json')
    surveyDecisionData: {
        survey_decision_number: string;
        survey_decision_date: string;
    }

    @Column('json')
    geolocationData: {
        honesty: string;
        municipal: string;
        district: string;
        planned_number: string;
        block_number: string;
    }

    @Column('json')
    midpointCoordinates: {
        abscissa: string;
        y_coordinate: string;
    }

    @Column('json')
    contractingData: {
        supervising_engineering_office: string;
        designer_engineering_office: string;
    }

    @Column('json')
    ownerData: {
        index: number;
        owner_name: string;
        id_number: string;
    }

    @Column('json')
    landData: {
        index: number;
        piece_number: string;
        land_area: string;
        land_area_plan: string;
    }

    @Column('json')
    buildingComponents: {
        building_component: string;
        component_usage: string;
        construction_ratio: string;
        floor_area: string;
        floors_number: string;
        units_number: string;
    }

    @Column('json')
    coordinates: {
        coordinate_number: string;
        abscissa: string;
        y_coordinate: string;
    }

    @Column('json')
    pledges: {
        pledge: string;
    }

    @Column('json')
    dimensions_boundaries: {
        instrument_limit: {
            north_instrument_limit: string;
            east_instrument_limit: string;
            south_instrument_limit: string;
            west_instrument_limit: string;
        };
        nature_limit: {
            north_nature_limit: string;
            east_nature_limit: string;
            south_nature_limit: string;
            west_nature_limit: string;
        };
        instrument_length: {
            north_instrument_length: string;
            east_instrument_length: string;
            south_instrument_length: string;
            west_instrument_length: string;
        };
        nature_length: {
            north_nature_length: string;
            east_nature_length: string;
            south_nature_length: string;
            west_nature_length: string;
        };
        bouncing: {
            north_bouncing: string;
            east_bouncing: string;
            south_bouncing: string;
            west_bouncing: string;
        };
        prominence: {
            north_prominence: string;
            east_prominence: string;
            south_prominence: string;
            west_prominence: string;
        };
    }

    @Column({ nullable: true })
    qrcode_url: string;
}